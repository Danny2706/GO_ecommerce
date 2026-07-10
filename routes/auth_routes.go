package routes

import (
	"go-e_commerce/controllers"
	"go-e_commerce/middleware"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(router *gin.RouterGroup) {

	auth := router.Group("/auth")

	auth.POST("/register", controllers.Register)
	auth.POST("/login", controllers.Login)

	protected := auth.Group("/")
	protected.Use(middleware.AuthMiddleware())

	protected.GET("/profile", controllers.Profile)
}