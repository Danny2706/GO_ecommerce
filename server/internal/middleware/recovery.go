package middleware

import (
	"fmt"
	"runtime/debug"

	"github.com/example/habeshamart/pkg/logger"
	"github.com/example/habeshamart/pkg/response"
	"github.com/gin-gonic/gin"
)

// Recovery recovers from panics gracefully and returns a standardized JSON 500 response.
// Go Concept: Panic Recovery with defer and recover() function.
func Recovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if r := recover(); r != nil {
				errStr := fmt.Sprintf("%v", r)
				logger.Log.Error("Panic recovered",
					"error", errStr,
					"stack", string(debug.Stack()),
				)
				response.InternalServerError(c, "An unexpected server error occurred", fmt.Errorf("%v", r))
				c.Abort()
			}
		}()
		c.Next()
	}
}
