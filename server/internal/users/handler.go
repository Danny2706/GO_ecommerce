package users

import (
	"errors"

	"github.com/example/habeshamart/pkg/response"
	"github.com/example/habeshamart/pkg/validator"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for user profile management.
type Handler struct {
	service Service
}

// NewHandler initializes a user HTTP handler.
func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// GetProfile handles fetching the authenticated user's profile.
func (h *Handler) GetProfile(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		response.Unauthorized(c, "Unauthorized access")
		return
	}

	userIDFloat, ok := userIDVal.(float64)
	if !ok {
		// Handle float conversion if JWT claims unmarshalled numbers as float64 or uint
		if uidInt, okInt := userIDVal.(uint); okInt {
			userIDFloat = float64(uidInt)
		} else {
			response.Unauthorized(c, "Invalid user context")
			return
		}
	}

	profile, err := h.service.GetProfile(c.Request.Context(), uint(userIDFloat))
	if err != nil {
		if errors.Is(err, ErrUserNotFound) {
			response.NotFound(c, "User profile not found")
			return
		}
		response.InternalServerError(c, "Failed to fetch user profile", err)
		return
	}

	response.Success(c, "Profile retrieved successfully", profile)
}

// UpdateProfile handles updating the authenticated user's profile details.
func (h *Handler) UpdateProfile(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		response.Unauthorized(c, "Unauthorized access")
		return
	}

	userIDFloat, ok := userIDVal.(float64)
	if !ok {
		if uidInt, okInt := userIDVal.(uint); okInt {
			userIDFloat = float64(uidInt)
		} else {
			response.Unauthorized(c, "Invalid user context")
			return
		}
	}

	var input UpdateProfileInput
	if err := c.ShouldBindJSON(&input); err != nil {
		msg := validator.FormatValidationError(err)
		response.BadRequest(c, msg, err)
		return
	}

	profile, err := h.service.UpdateProfile(c.Request.Context(), uint(userIDFloat), input)
	if err != nil {
		response.InternalServerError(c, "Failed to update profile", err)
		return
	}

	response.Success(c, "Profile updated successfully", profile)
}
