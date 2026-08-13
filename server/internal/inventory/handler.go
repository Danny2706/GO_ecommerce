package inventory

import (
	"errors"

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
	return &Handler{
		service: service,
	}
}

// GetStatus handles fetching inventory status for all products.
func (h *Handler) GetStatus(c *gin.Context) {

	items, err := h.service.GetInventoryStatus(c.Request.Context())
	if err != nil {
		response.InternalServerError(
			c,
			"Failed to fetch inventory status",
			err,
		)
		return
	}

	response.Success(
		c,
		"Inventory status retrieved successfully",
		items,
	)
}

// AdjustStock handles adjusting inventory stock level.
func (h *Handler) AdjustStock(c *gin.Context) {

	var input AdjustStockInput

	if err := c.ShouldBindJSON(&input); err != nil {
		msg := validator.FormatValidationError(err)

		response.BadRequest(
			c,
			msg,
			err,
		)

		return
	}

	log, err := h.service.AdjustStock(
		c.Request.Context(),
		input,
	)

	if err != nil {

		if errors.Is(err, products.ErrProductNotFound) {
			response.NotFound(
				c,
				"Product not found",
			)

			return
		}

		response.InternalServerError(
			c,
			"Failed to adjust stock",
			err,
		)

		return
	}

	response.Success(
		c,
		"Stock adjusted successfully",
		log,
	)
}