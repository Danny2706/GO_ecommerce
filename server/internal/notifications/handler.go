package notifications

import (
	"strconv"

	"github.com/example/habeshamart/pkg/response"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for notifications.
type Handler struct {
	service Service
}

// NewHandler initializes a notification HTTP handler.
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

// List handles fetching user notifications.
func (h *Handler) List(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Unauthorized(c, "Unauthorized access")
		return
	}

	list, err := h.service.GetUserNotifications(c.Request.Context(), userID)
	if err != nil {
		response.InternalServerError(c, "Failed to fetch notifications", err)
		return
	}

	response.Success(c, "Notifications retrieved successfully", list)
}

// MarkAsRead handles marking a notification as read.
func (h *Handler) MarkAsRead(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		response.Unauthorized(c, "Unauthorized access")
		return
	}

	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid notification ID", err)
		return
	}

	if err := h.service.MarkAsRead(c.Request.Context(), uint(id), userID); err != nil {
		response.InternalServerError(c, "Failed to mark notification as read", err)
		return
	}

	response.Success(c, "Notification marked as read", nil)
}
