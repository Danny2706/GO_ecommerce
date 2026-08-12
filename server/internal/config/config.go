package config

import (
	"os"

	"github.com/joho/godotenv"
)

// Config holds all configuration parameters for the application.
// Go Concept: Struct tags can be used to map environment variables or configuration fields.
type Config struct {
	Port        string
	DatabaseURL string
	RedisURL    string
	JWTSecret   string
	Environment string
}

// LoadConfig loads application configuration from environment variables and an optional .env file.
func LoadConfig() (*Config, error) {
	// Attempt to load .env file if available (ignore error if file is missing in production environments)
	_ = godotenv.Load()

	cfg := &Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/habeshamart?sslmode=disable"),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379/0"),
		JWTSecret:   getEnv("JWT_SECRET", "super-secret-habeshamart-key-change-in-production"),
		Environment: getEnv("ENVIRONMENT", "development"),
	}

	return cfg, nil
}

// Helper function to fetch environment variables with fallback default values
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists && value != "" {
		return value
	}
	return defaultValue
}
