package payments

import (
	"errors"
	"strconv"

	"github.com/example/habeshamart/internal/orders"
	"github.com/example/habeshamart/pkg/response"
	"github.com/example/habeshamart/pkg/validator"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for payments.
type Handler struct {
	service Service
}

// NewHandler initializes a payment HTTP handler.
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

// Checkout handles payment initialization for an order.
func (h *Handler) Checkout(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Unauthorized(c, "Unauthorized access")
		return
	}

	var input CheckoutInput
	if err := c.ShouldBindJSON(&input); err != nil {
		msg := validator.FormatValidationError(err)
		response.BadRequest(c, msg, err)
		return
	}

	payment, err := h.service.Checkout(c.Request.Context(), userID, input)
	if err != nil {
		if errors.Is(err, orders.ErrOrderNotFound) {
			response.NotFound(c, "Order not found")
			return
		}
		response.InternalServerError(c, "Failed to initiate checkout", err)
		return
	}

	response.Success(c, "Payment checkout initiated", payment)
}

// Webhook handles payment provider notification callbacks.
func (h *Handler) Webhook(c *gin.Context) {
	var input WebhookInput
	if err := c.ShouldBindJSON(&input); err != nil {
		msg := validator.FormatValidationError(err)
		response.BadRequest(c, msg, err)
		return
	}

	if err := h.service.ProcessWebhook(c.Request.Context(), input); err != nil {
		if errors.Is(err, ErrPaymentNotFound) {
			response.NotFound(c, "Payment not found")
			return
		}
		response.InternalServerError(c, "Failed to process payment webhook", err)
		return
	}

	response.Success(c, "Payment status updated via webhook", nil)
}

// GetStatus handles fetching payment record for an order.
func (h *Handler) GetStatus(c *gin.Context) {
	idParam := c.Param("order_id")
	orderID, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid order ID", err)
		return
	}

	payment, err := h.service.GetPaymentByOrderID(c.Request.Context(), uint(orderID))
	if err != nil {
		if errors.Is(err, ErrPaymentNotFound) {
			response.NotFound(c, "Payment not found")
			return
		}
		response.InternalServerError(c, "Failed to fetch payment status", err)
		return
	}

	response.Success(c, "Payment status retrieved", payment)
}
