package database

import (
	"context"
	"fmt"

	"github.com/example/habeshamart/pkg/logger"
	"github.com/redis/go-redis/v9"
)

// InitRedis initializes and tests a Redis client instance.
// Go Concept: Context for timeout and cancellation management when communicating with remote servers.
func InitRedis(redisURL string) (*redis.Client, error) {
	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		return nil, fmt.Errorf("invalid redis URL: %w", err)
	}

	client := redis.NewClient(opts)

	ctx := context.Background()
	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("failed to ping redis: %w", err)
	}

	logger.Log.Info("Successfully connected to Redis cache")
	return client, nil
}
