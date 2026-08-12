package orders

import (
	"github.com/example/habeshamart/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes registers order processing endpoints (/api/v1/orders).
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	ordersGroup := rg.Group("/orders")
	{
		ordersGroup.GET("", func(c *gin.Context) {
			response.Success(c, "List user orders endpoint placeholder", []string{})
		})
	}
}
