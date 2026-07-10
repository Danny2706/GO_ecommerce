package main

import (
	"go-e_commerce/config"
	"go-e_commerce/models"
	"go-e_commerce/routes"

	"github.com/gin-gonic/gin"
)

func main() {

	config.ConnectDB()

	config.DB.AutoMigrate(
		&models.User{},
	)

	router := gin.Default()

	routes.SetupRoutes(router)

	router.Run(":8080")
}