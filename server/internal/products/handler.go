package products

import (
	"errors"
	"strconv"

	"github.com/example/habeshamart/pkg/response"
	"github.com/example/habeshamart/pkg/validator"
	"github.com/gin-gonic/gin"
)

// Handler handles HTTP requests for products endpoint.
type Handler struct {
	service Service
}

// NewHandler initializes a product HTTP handler.
func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

// Create handles product creation.
func (h *Handler) Create(c *gin.Context) {
	var input CreateProductInput
	if err := c.ShouldBindJSON(&input); err != nil {
		msg := validator.FormatValidationError(err)
		response.BadRequest(c, msg, err)
		return
	}

	product, err := h.service.CreateProduct(c.Request.Context(), input)
	if err != nil {
		response.InternalServerError(c, "Failed to create product", err)
		return
	}

	response.Created(c, "Product created successfully", product)
}

// GetByID handles fetching a single product by ID.
func (h *Handler) GetByID(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid product ID", err)
		return
	}

	product, err := h.service.GetProductByID(c.Request.Context(), uint(id))
	if err != nil {
		if errors.Is(err, ErrProductNotFound) {
			response.NotFound(c, "Product not found")
			return
		}
		response.InternalServerError(c, "Failed to fetch product", err)
		return
	}

	response.Success(c, "Product retrieved successfully", product)
}

// List handles paginated and filtered product listing.
func (h *Handler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	categoryID, _ := strconv.ParseUint(c.Query("category_id"), 10, 32)
	search := c.Query("search")

	filter := ProductFilter{
		CategoryID: uint(categoryID),
		Search:     search,
		Page:       page,
		PageSize:   pageSize,
	}

	products, total, err := h.service.ListProducts(c.Request.Context(), filter)
	if err != nil {
		response.InternalServerError(c, "Failed to fetch products", err)
		return
	}

	response.Success(c, "Products retrieved successfully", gin.H{
		"items":     products,
		"total":     total,
		"page":      page,
		"page_size": pageSize,
	})
}

// Update handles product updates.
func (h *Handler) Update(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid product ID", err)
		return
	}

	var input UpdateProductInput
	if err := c.ShouldBindJSON(&input); err != nil {
		msg := validator.FormatValidationError(err)
		response.BadRequest(c, msg, err)
		return
	}

	product, err := h.service.UpdateProduct(c.Request.Context(), uint(id), input)
	if err != nil {
		if errors.Is(err, ErrProductNotFound) {
			response.NotFound(c, "Product not found")
			return
		}
		response.InternalServerError(c, "Failed to update product", err)
		return
	}

	response.Success(c, "Product updated successfully", product)
}

// Delete handles product deletion.
func (h *Handler) Delete(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		response.BadRequest(c, "Invalid product ID", err)
		return
	}

	if err := h.service.DeleteProduct(c.Request.Context(), uint(id)); err != nil {
		if errors.Is(err, ErrProductNotFound) {
			response.NotFound(c, "Product not found")
			return
		}
		response.InternalServerError(c, "Failed to delete product", err)
		return
	}

	response.Success(c, "Product deleted successfully", nil)
}
