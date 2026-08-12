package categories

import (
	"errors"
	"strconv"

	"github.com/example/habeshamart/pkg/response"
	"github.com/example/habeshamart/pkg/validator"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for categories.
type Handler struct {
	service Service
}

// NewHandler initializes a category HTTP handler.
func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// Create handles creating a category.
func (h *Handler) Create(c *gin.Context) {
	var input CreateCategoryInput
	if err := c.ShouldBindJSON(&input); err != nil {
		msg := validator.FormatValidationError(err)
		response.BadRequest(c, msg, err)
		return
	}

	category, err := h.service.CreateCategory(c.Request.Context(), input)
	if err != nil {
		response.InternalServerError(c, "Failed to create category", err)
		return
	}

	response.Created(c, "Category created successfully", category)
}

// GetByID handles fetching a category by ID.
func (h *Handler) GetByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid category ID", err)
		return
	}

	category, err := h.service.GetCategoryByID(c.Request.Context(), uint(id))
	if err != nil {
		if errors.Is(err, ErrCategoryNotFound) {
			response.NotFound(c, "Category not found")
			return
		}
		response.InternalServerError(c, "Failed to fetch category", err)
		return
	}

	response.Success(c, "Category retrieved successfully", category)
}

// List handles fetching all categories.
func (h *Handler) List(c *gin.Context) {
	cats, err := h.service.ListCategories(c.Request.Context())
	if err != nil {
		response.InternalServerError(c, "Failed to fetch categories", err)
		return
	}

	response.Success(c, "Categories retrieved successfully", cats)
}

// Update handles updating a category.
func (h *Handler) Update(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid category ID", err)
		return
	}

	var input UpdateCategoryInput
	if err := c.ShouldBindJSON(&input); err != nil {
		msg := validator.FormatValidationError(err)
		response.BadRequest(c, msg, err)
		return
	}

	category, err := h.service.UpdateCategory(c.Request.Context(), uint(id), input)
	if err != nil {
		if errors.Is(err, ErrCategoryNotFound) {
			response.NotFound(c, "Category not found")
			return
		}
		response.InternalServerError(c, "Failed to update category", err)
		return
	}

	response.Success(c, "Category updated successfully", category)
}

// Delete handles removing a category.
func (h *Handler) Delete(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid category ID", err)
		return
	}

	if err := h.service.DeleteCategory(c.Request.Context(), uint(id)); err != nil {
		if errors.Is(err, ErrCategoryNotFound) {
			response.NotFound(c, "Category not found")
			return
		}
		response.InternalServerError(c, "Failed to delete category", err)
		return
	}

	response.Success(c, "Category deleted successfully", nil)
}
