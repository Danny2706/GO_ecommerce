package payments

import (
	"github.com/example/habeshamart/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes registers payment gateway integration endpoints (/api/v1/payments).
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	paymentsGroup := rg.Group("/payments")
	{
		paymentsGroup.POST("/checkout", func(c *gin.Context) {
			response.Success(c, "Initiate payment checkout placeholder", nil)
		})
	}
}
