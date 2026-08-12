package users

import (
	"github.com/example/habeshamart/internal/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes registers user management endpoints (/api/v1/users).
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB, jwtSecret string) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	usersGroup := rg.Group("/users")
	usersGroup.Use(middleware.Authenticate(jwtSecret))
	{
		usersGroup.GET("/me", handler.GetProfile)
		usersGroup.PUT("/me", handler.UpdateProfile)
	}
}
