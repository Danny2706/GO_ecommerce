package cart

import (
	"github.com/example/habeshamart/internal/middleware"
	"github.com/example/habeshamart/internal/products"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes registers shopping cart endpoints (/api/v1/cart).
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB, jwtSecret string) {
	repo := NewRepository(db)
	productRepo := products.NewRepository(db)
	service := NewService(repo, productRepo)
	handler := NewHandler(service)

	cartGroup := rg.Group("/cart")
	cartGroup.Use(middleware.Authenticate(jwtSecret))
	{
		cartGroup.GET("", handler.GetCart)
		cartGroup.POST("/items", handler.AddItem)
		cartGroup.PUT("/items/:id", handler.UpdateItem)
		cartGroup.DELETE("/items/:id", handler.RemoveItem)
		cartGroup.DELETE("", handler.ClearCart)
	}
}
