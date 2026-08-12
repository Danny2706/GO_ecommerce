package cart

import (
	"github.com/example/habeshamart/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes registers shopping cart endpoints (/api/v1/cart).
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	cartGroup := rg.Group("/cart")
	{
		cartGroup.GET("", func(c *gin.Context) {
			response.Success(c, "Get cart items endpoint placeholder", nil)
		})
	}
}
