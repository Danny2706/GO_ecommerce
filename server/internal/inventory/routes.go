package inventory

import (
	"github.com/example/habeshamart/internal/products"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes registers inventory tracking endpoints.
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {

	repo := NewRepository(db)

	productRepo := products.NewRepository(db)

	service := NewService(
		repo,
		productRepo,
	)

	handler := NewHandler(service)

	inventoryGroup := rg.Group("/inventory")
	{
		inventoryGroup.GET(
			"/status",
			handler.GetStatus,
		)

		inventoryGroup.POST(
			"/adjust",
			handler.AdjustStock,
		)
	}
}