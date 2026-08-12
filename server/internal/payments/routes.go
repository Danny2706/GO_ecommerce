package payments

import (
	"github.com/example/habeshamart/internal/middleware"
	"github.com/example/habeshamart/internal/orders"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes registers payment gateway integration endpoints (/api/v1/payments).
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB, jwtSecret string) {
	repo := NewRepository(db)
	orderRepo := orders.NewRepository(db)
	service := NewService(repo, orderRepo)
	handler := NewHandler(service)

	paymentsGroup := rg.Group("/payments")
	{
		paymentsGroup.POST("/webhook", handler.Webhook)
		paymentsGroup.GET("/order/:order_id", handler.GetStatus)
	}

	protected := paymentsGroup.Group("")
	protected.Use(middleware.Authenticate(jwtSecret))
	{
		protected.POST("/checkout", handler.Checkout)
	}
}
