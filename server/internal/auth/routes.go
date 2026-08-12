package auth

import (
	"github.com/example/habeshamart/pkg/response"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// RegisterRoutes registers endpoints for authentication (/api/v1/auth).
func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB, jwtSecret string) {
	authGroup := rg.Group("/auth")
	{
		authGroup.POST("/register", func(c *gin.Context) {
			response.Success(c, "Auth register endpoint placeholder", nil)
		})
		authGroup.POST("/login", func(c *gin.Context) {
			response.Success(c, "Auth login endpoint placeholder", nil)
		})
	}
}
