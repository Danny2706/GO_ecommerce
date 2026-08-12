package inventory

import (
	"github.com/example/habeshamart/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes registers inventory tracking endpoints (/api/v1/inventory).
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	inventoryGroup := rg.Group("/inventory")
	{
		inventoryGroup.GET("/status", func(c *gin.Context) {
			response.Success(c, "Get inventory status placeholder", nil)
		})
	}
}
