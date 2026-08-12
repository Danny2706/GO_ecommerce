package orders

import (
	"errors"
	"strconv"

	"github.com/example/habeshamart/pkg/response"
	"github.com/example/habeshamart/pkg/validator"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for orders endpoint.
type Handler struct {
	service Service
}

// NewHandler initializes an order HTTP handler.
func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func getUserID(c *gin.Context) (uint, bool) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		return 0, false
	}
	if uidFloat, ok := userIDVal.(float64); ok {
		return uint(uidFloat), true
	}
	if uidUint, ok := userIDVal.(uint); ok {
		return uidUint, true
	}
	return 0, false
}

// Create handles order checkout placement.
func (h *Handler) Create(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Unauthorized(c, "Unauthorized access")
		return
	}

	var input CreateOrderInput
	if err := c.ShouldBindJSON(&input); err != nil {
		msg := validator.FormatValidationError(err)
		response.BadRequest(c, msg, err)
		return
	}

	order, err := h.service.CreateOrder(c.Request.Context(), userID, input)
	if err != nil {
		response.InternalServerError(c, "Failed to create order", err)
		return
	}

	response.Created(c, "Order placed successfully", order)
}

// GetByID handles fetching details for a specific order.
func (h *Handler) GetByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid order ID", err)
		return
	}

	order, err := h.service.GetOrderByID(c.Request.Context(), uint(id))
	if err != nil {
		if errors.Is(err, ErrOrderNotFound) {
			response.NotFound(c, "Order not found")
			return
		}
		response.InternalServerError(c, "Failed to fetch order", err)
		return
	}

	response.Success(c, "Order retrieved successfully", order)
}

// List handles listing all orders for the authenticated user.
func (h *Handler) List(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Unauthorized(c, "Unauthorized access")
		return
	}

	ordersList, err := h.service.ListUserOrders(c.Request.Context(), userID)
	if err != nil {
		response.InternalServerError(c, "Failed to fetch orders", err)
		return
	}

	response.Success(c, "Orders retrieved successfully", ordersList)
}

// UpdateStatus handles updating an order status (admin/internal).
func (h *Handler) UpdateStatus(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid order ID", err)
		return
	}

	var input UpdateOrderStatusInput
	if err := c.ShouldBindJSON(&input); err != nil {
		msg := validator.FormatValidationError(err)
		response.BadRequest(c, msg, err)
		return
	}

	order, err := h.service.UpdateOrderStatus(c.Request.Context(), uint(id), input.Status)
	if err != nil {
		if errors.Is(err, ErrOrderNotFound) {
			response.NotFound(c, "Order not found")
			return
		}
		response.InternalServerError(c, "Failed to update order status", err)
		return
	}

	response.Success(c, "Order status updated successfully", order)
}
