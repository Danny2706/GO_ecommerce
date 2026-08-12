package users

import (
	"github.com/example/habeshamart/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes registers user management endpoints (/api/v1/users).
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {
	usersGroup := rg.Group("/users")
	{
		usersGroup.GET("/me", func(c *gin.Context) {
			response.Success(c, "Get profile endpoint placeholder", nil)
		})
	}
}
