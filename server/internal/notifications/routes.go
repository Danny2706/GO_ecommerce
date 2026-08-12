package notifications

import (
	"github.com/example/habeshamart/internal/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes registers user notification endpoints (/api/v1/notifications).
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB, jwtSecret string) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	notificationsGroup := rg.Group("/notifications")
	notificationsGroup.Use(middleware.Authenticate(jwtSecret))
	{
		notificationsGroup.GET("", handler.List)
		notificationsGroup.PATCH("/:id/read", handler.MarkAsRead)
	}
}
