package inventory

import (
	"errors"
	"strconv"

	"github.com/example/habeshamart/internal/products"
	"github.com/example/habeshamart/pkg/response"
	"github.com/example/habeshamart/pkg/validator"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for inventory tracking.
type Handler struct {
	service Service
}

// NewHandler initializes an inventory HTTP handler.
func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// GetStatus handles fetching inventory logs and stock level for a product.
func (h *Handler) GetStatus(c *gin.Context) {
	idParam := c.Query("product_id")
	productID, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid product_id parameter", err)
		return
	}

	product, logs, err := h.service.GetInventoryStatus(c.Request.Context(), uint(productID))
	if err != nil {
		if errors.Is(err, products.ErrProductNotFound) {
			response.NotFound(c, "Product not found")
			return
		}
		response.InternalServerError(c, "Failed to fetch inventory status", err)
		return
	}

	response.Success(c, "Inventory status retrieved", gin.H{
		"product": product,
		"logs":    logs,
	})
}

// AdjustStock handles adjusting inventory stock level.
func (h *Handler) AdjustStock(c *gin.Context) {
	var input AdjustStockInput
	if err := c.ShouldBindJSON(&input); err != nil {
		msg := validator.FormatValidationError(err)
		response.BadRequest(c, msg, err)
		return
	}

	log, err := h.service.AdjustStock(c.Request.Context(), input)
	if err != nil {
		if errors.Is(err, products.ErrProductNotFound) {
			response.NotFound(c, "Product not found")
			return
		}
		response.InternalServerError(c, "Failed to adjust stock", err)
		return
	}

	response.Success(c, "Stock adjusted successfully", log)
}
