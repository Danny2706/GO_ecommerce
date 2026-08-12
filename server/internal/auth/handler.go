package auth

import (
	"errors"

	"github.com/example/habeshamart/pkg/response"
	"github.com/example/habeshamart/pkg/validator"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for user authentication.
type Handler struct {
	service Service
}

// NewHandler initializes an auth HTTP handler.
func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// Register handles new user registration.
func (h *Handler) Register(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		msg := validator.FormatValidationError(err)
		response.BadRequest(c, msg, err)
		return
	}

	authResp, err := h.service.Register(c.Request.Context(), input)
	if err != nil {
		if errors.Is(err, ErrEmailAlreadyExists) {
			response.BadRequest(c, "Email already registered", err)
			return
		}
		response.InternalServerError(c, "Failed to register user", err)
		return
	}

	response.Created(c, "User registered successfully", authResp)
}

// Login handles user login and token generation.
func (h *Handler) Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		msg := validator.FormatValidationError(err)
		response.BadRequest(c, msg, err)
		return
	}

	authResp, err := h.service.Login(c.Request.Context(), input)
	if err != nil {
		if errors.Is(err, ErrInvalidCredentials) {
			response.Unauthorized(c, "Invalid email or password")
			return
		}
		response.InternalServerError(c, "Failed to login", err)
		return
	}

	response.Success(c, "Login successful", authResp)
}
