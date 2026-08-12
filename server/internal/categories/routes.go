package categories

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes registers product category endpoints (/api/v1/categories).
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	categoriesGroup := rg.Group("/categories")
	{
		categoriesGroup.GET("", handler.List)
		categoriesGroup.POST("", handler.Create)
		categoriesGroup.GET("/:id", handler.GetByID)
		categoriesGroup.PUT("/:id", handler.Update)
		categoriesGroup.DELETE("/:id", handler.Delete)
	}
}
