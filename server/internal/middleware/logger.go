package middleware

import (
	"log/slog"
	"time"

	"github.com/example/habeshamart/pkg/logger"
	"github.com/gin-gonic/gin"
)

// Logger returns structured HTTP request logging middleware.
// Go Concept: High-performance logging using slog attributes and request duration measurement.
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		rawQuery := c.Request.URL.RawQuery

		c.Next()

		latency := time.Since(start)
		clientIP := c.ClientIP()
		method := c.Request.Method
		statusCode := c.Writer.Status()

		if rawQuery != "" {
			path = path + "?" + rawQuery
		}

		logger.Log.Info("HTTP Request",
			slog.String("method", method),
			slog.String("path", path),
			slog.Int("status", statusCode),
			slog.Duration("latency", latency),
			slog.String("ip", clientIP),
		)
	}
}
