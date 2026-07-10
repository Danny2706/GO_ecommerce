package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	err := godotenv.Load()

	if err != nil {
		log.Println(".env file not found")
	}

	dsn := os.Getenv("DATABASE_URL")

	db, err := gorm.Open(
		postgres.Open(dsn),
		&gorm.Config{},
	)

	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	DB = db

	log.Println("Neon Database Connected Successfully")
}