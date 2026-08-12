package main

import (
	"context"
	"errors"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/example/habeshamart/internal/auth"
	"github.com/example/habeshamart/internal/cart"
	"github.com/example/habeshamart/internal/categories"
	"github.com/example/habeshamart/internal/config"
	"github.com/example/habeshamart/internal/database"
	"github.com/example/habeshamart/internal/inventory"
	"github.com/example/habeshamart/internal/middleware"
	"github.com/example/habeshamart/internal/notifications"
	"github.com/example/habeshamart/internal/orders"
	"github.com/example/habeshamart/internal/payments"
	"github.com/example/habeshamart/internal/products"
	"github.com/example/habeshamart/internal/users"
	"github.com/example/habeshamart/pkg/logger"
	"github.com/example/habeshamart/pkg/response"
	"github.com/gin-gonic/gin"
)

// Go Concept: main function is the entry point of every Go executable application.
func main() {
	// 1. Load configuration parameters
	cfg, err := config.LoadConfig()
	if err != nil {
		panic("Failed to load configuration: " + err.Error())
	}

	// 2. Initialize structured logging
	logger.InitLogger(cfg.Environment)
	logger.Log.Info("Starting HabeshaMart API service", "env", cfg.Environment)

	// Set Gin mode
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 3. Initialize PostgreSQL database connection via GORM
	db, err := database.InitDB(cfg.DatabaseURL)
	if err != nil {
		logger.Log.Warn("Database connection deferred/failed", "error", err.Error())
	} else {
		// AutoMigrate initial models for development
		if err := db.AutoMigrate(&products.Product{}); err != nil {
			logger.Log.Error("Failed to auto-migrate database models", "error", err.Error())
		}
	}

	// 4. Initialize Redis cache connection
	rdb, err := database.InitRedis(cfg.RedisURL)
	if err != nil {
		logger.Log.Warn("Redis connection deferred/failed", "error", err.Error())
	}

	// 5. Create Gin Web Router with zero default middlewares
	r := gin.New()

	// 6. Register Global Middlewares
	r.Use(middleware.Logger())
	r.Use(middleware.Recovery())
	r.Use(middleware.CORS())
	if rdb != nil {
		r.Use(middleware.RateLimiter(rdb))
	}

	// 7. System Health Check Route
	r.GET("/health", func(c *gin.Context) {
		dbStatus := "disconnected"
		if db != nil {
			if sqlDB, err := db.DB(); err == nil && sqlDB.Ping() == nil {
				dbStatus = "connected"
			}
		}

		redisStatus := "disconnected"
		if rdb != nil {
			if err := rdb.Ping(c.Request.Context()).Err(); err == nil {
				redisStatus = "connected"
			}
		}

		response.Success(c, "HabeshaMart API is healthy", gin.H{
			"status":      "UP",
			"timestamp":   time.Now().Format(time.RFC3339),
			"database":    dbStatus,
			"redis":       redisStatus,
			"environment": cfg.Environment,
		})
	})

	// 8. Register API v1 Route Groups
	v1 := r.Group("/api/v1")
	{
		auth.RegisterRoutes(v1, db, cfg.JWTSecret)
		users.RegisterRoutes(v1, db)
		if db != nil {
			products.RegisterRoutes(v1, db)
		}
		categories.RegisterRoutes(v1, db)
		cart.RegisterRoutes(v1, db)
		orders.RegisterRoutes(v1, db)
		payments.RegisterRoutes(v1, db)
		inventory.RegisterRoutes(v1, db)
		notifications.RegisterRoutes(v1, db)
	}

	// 9. Configure HTTP Server with Timeout Settings
	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Go Concept: Graceful Shutdown using Channels & OS Signal interception
	go func() {
		logger.Log.Info("Server listening on port", "port", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Log.Error("HTTP server failed", "error", err.Error())
			os.Exit(1)
		}
	}()

	// Wait for interrupt signal to gracefully shut down the server with a timeout of 5 seconds.
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Log.Info("Shutting down server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		logger.Log.Error("Server forced to shutdown", "error", err.Error())
	}

	logger.Log.Info("Server exiting gracefully")
}
