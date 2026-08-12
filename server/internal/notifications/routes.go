package notifications

import (
	"github.com/example/habeshamart/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes registers user notification endpoints (/api/v1/notifications).
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	notificationsGroup := rg.Group("/notifications")
	{
		notificationsGroup.GET("", func(c *gin.Context) {
			response.Success(c, "List notifications placeholder", []string{})
		})
	}
}
