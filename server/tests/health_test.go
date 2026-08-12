package tests

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/example/habeshamart/pkg/response"
	"github.com/gin-gonic/gin"
)

// TestHealthCheck verifies that the health check endpoint returns 200 OK with success payload.
// Go Concept: Go unit tests start with TestXxx(t *testing.T) in files named *_test.go.
func TestHealthCheck(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()

	router.GET("/health", func(c *gin.Context) {
		response.Success(c, "HabeshaMart API is healthy", gin.H{"status": "UP"})
	})

	req, err := http.NewRequest(http.MethodGet, "/health", nil)
	if err != nil {
		t.Fatalf("Failed to create HTTP request: %v", err)
	}

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, w.Code)
	}

	var res response.Response
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("Failed to parse JSON response: %v", err)
	}

	if !res.Success {
		t.Errorf("Expected success to be true, got %v", res.Success)
	}
}
