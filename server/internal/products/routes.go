package products

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes initializes product handler dependencies and binds endpoints to gin router group.
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	products := rg.Group("/products")
	{
		products.POST("", handler.Create)
		products.GET("", handler.List)
		products.GET("/:id", handler.GetByID)
		products.PUT("/:id", handler.Update)
		products.DELETE("/:id", handler.Delete)
	}
}
