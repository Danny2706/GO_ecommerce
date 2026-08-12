package middleware

import (
	"fmt"
	"time"

	"github.com/example/habeshamart/pkg/response"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

// RateLimiter returns a Gin middleware for Redis sliding window rate limiting.
func RateLimiter(rdb *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		if rdb == nil {
			c.Next()
			return
		}

		ip := c.ClientIP()
		key := fmt.Sprintf("rate_limit:%s", ip)

		ctx := c.Request.Context()
		now := time.Now().Unix()
		window := int64(60) // 1 minute window
		limit := int64(100) // max 100 requests per minute

		pipe := rdb.Pipeline()
		pipe.ZRemRangeByScore(ctx, key, "0", fmt.Sprintf("%d", now-window))
		pipe.ZAdd(ctx, key, redis.Z{Score: float64(now), Member: fmt.Sprintf("%d", now)})
		countCmd := pipe.ZCard(ctx, key)
		pipe.Expire(ctx, key, time.Duration(window)*time.Second)

		_, err := pipe.Exec(ctx)
		if err != nil {
			// On Redis error, allow request to proceed without crashing
			c.Next()
			return
		}

		if countCmd.Val() > limit {
			response.JSON(c, 429, false, "Rate limit exceeded. Please try again later.", nil, "Too many requests")
			c.Abort()
			return
		}

		c.Next()
	}
}
