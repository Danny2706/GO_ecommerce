package routes

import (
	"go-e_commerce/controllers"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(router *gin.RouterGroup) {

	auth := router.Group("/auth")

	auth.POST("/register", controllers.Register)
	auth.POST("/login", controllers.Login)
}