package categories

import (
	"github.com/example/habeshamart/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes registers product category endpoints (/api/v1/categories).
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	categoriesGroup := rg.Group("/categories")
	{
		categoriesGroup.GET("", func(c *gin.Context) {
			response.Success(c, "List categories endpoint placeholder", []string{})
		})
	}
}
