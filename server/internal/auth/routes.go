package auth

import (
	"github.com/example/habeshamart/internal/users"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes registers endpoints for authentication (/api/v1/auth).
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB, jwtSecret string) {
	userRepo := users.NewRepository(db)
	authService := NewService(userRepo, jwtSecret)
	handler := NewHandler(authService)

	authGroup := rg.Group("/auth")
	{
		authGroup.POST("/register", handler.Register)
		authGroup.POST("/login", handler.Login)
	}
}
