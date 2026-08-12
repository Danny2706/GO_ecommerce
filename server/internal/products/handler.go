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
// @Tags Products
// @Accept json
// @Produce json
// @Router /api/v1/products [post]
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
// @Tags Products
// @Produce json
// @Router /api/v1/products/{id} [get]
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

// List handles paginated product listing.
// @Tags Products
// @Produce json
// @Router /api/v1/products [get]
func (h *Handler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	products, total, err := h.service.ListProducts(c.Request.Context(), page, pageSize)
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
