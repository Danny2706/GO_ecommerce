package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Response represents a standard JSON API response structure.
// Go Concept: Structs with JSON Tags
// `omitempty` excludes fields when they are zero-value/nil.
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// JSON sends a custom structured JSON response.
func JSON(c *gin.Context, statusCode int, success bool, message string, data interface{}, err string) {
	c.JSON(statusCode, Response{
		Success: success,
		Message: message,
		Data:    data,
		Error:   err,
	})
}

// Success sends an HTTP 200 OK success response with data.
func Success(c *gin.Context, message string, data interface{}) {
	JSON(c, http.StatusOK, true, message, data, "")
}

// Created sends an HTTP 201 Created success response.
func Created(c *gin.Context, message string, data interface{}) {
	JSON(c, http.StatusCreated, true, message, data, "")
}

// BadRequest sends an HTTP 400 Bad Request error response.
func BadRequest(c *gin.Context, message string, err error) {
	errStr := ""
	if err != nil {
		errStr = err.Error()
	}
	JSON(c, http.StatusBadRequest, false, message, nil, errStr)
}

// Unauthorized sends an HTTP 401 Unauthorized error response.
func Unauthorized(c *gin.Context, message string) {
	JSON(c, http.StatusUnauthorized, false, message, nil, "Unauthorized access")
}

// Forbidden sends an HTTP 403 Forbidden error response.
func Forbidden(c *gin.Context, message string) {
	JSON(c, http.StatusForbidden, false, message, nil, "Permission denied")
}

// NotFound sends an HTTP 404 Not Found error response.
func NotFound(c *gin.Context, message string) {
	JSON(c, http.StatusNotFound, false, message, nil, "Resource not found")
}

// InternalServerError sends an HTTP 500 Internal Server Error response.
func InternalServerError(c *gin.Context, message string, err error) {
	errStr := ""
	if err != nil {
		errStr = err.Error()
	}
	JSON(c, http.StatusInternalServerError, false, message, nil, errStr)
}
