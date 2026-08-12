package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/example/habeshamart/internal/auth"
	"github.com/example/habeshamart/internal/cart"
	"github.com/example/habeshamart/internal/categories"
	"github.com/example/habeshamart/internal/inventory"
	"github.com/example/habeshamart/internal/notifications"
	"github.com/example/habeshamart/internal/orders"
	"github.com/example/habeshamart/internal/payments"
	"github.com/example/habeshamart/internal/products"
	"github.com/example/habeshamart/internal/users"
	"github.com/example/habeshamart/pkg/response"
	"github.com/gin-gonic/gin"
)

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	v1 := r.Group("/api/v1")
	{
		auth.RegisterRoutes(v1, nil, "test-secret")
		users.RegisterRoutes(v1, nil, "test-secret")
		products.RegisterRoutes(v1, nil)
		categories.RegisterRoutes(v1, nil)
		cart.RegisterRoutes(v1, nil, "test-secret")
		orders.RegisterRoutes(v1, nil, "test-secret")
		payments.RegisterRoutes(v1, nil, "test-secret")
		inventory.RegisterRoutes(v1, nil)
		notifications.RegisterRoutes(v1, nil, "test-secret")
	}
	return r
}

func TestUnauthenticatedRoutes(t *testing.T) {
	router := setupTestRouter()

	protectedEndpoints := []struct {
		method string
		path   string
	}{
		{http.MethodGet, "/api/v1/users/me"},
		{http.MethodGet, "/api/v1/cart"},
		{http.MethodGet, "/api/v1/orders"},
		{http.MethodGet, "/api/v1/notifications"},
	}

	for _, ep := range protectedEndpoints {
		req, _ := http.NewRequest(ep.method, ep.path, nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Errorf("[%s %s] Expected status %d, got %d", ep.method, ep.path, http.StatusUnauthorized, w.Code)
		}
	}
}

func TestAuthValidation(t *testing.T) {
	router := setupTestRouter()

	invalidPayload := map[string]string{
		"email": "invalid-email",
	}
	body, _ := json.Marshal(invalidPayload)

	req, _ := http.NewRequest(http.MethodPost, "/api/v1/auth/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status 400 Bad Request, got %d", w.Code)
	}

	var res response.Response
	_ = json.Unmarshal(w.Body.Bytes(), &res)

	if res.Success {
		t.Errorf("Expected success to be false, got true")
	}
}
