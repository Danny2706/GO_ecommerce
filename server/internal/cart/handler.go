// package cart

// import (
// 	"errors"
// 	"strconv"

// 	"github.com/example/habeshamart/internal/products"
// 	"github.com/example/habeshamart/pkg/response"
// 	"github.com/example/habeshamart/pkg/validator"
// 	"github.com/gin-gonic/gin"
// )

// // Handler handles HTTP requests for cart endpoints.
// type Handler struct {
// 	service Service
// }

// // NewHandler initializes a cart HTTP handler.
// func NewHandler(service Service) *Handler {
// 	return &Handler{service: service}
// }

// func getUserID(c *gin.Context) (uint, bool) {
// 	userIDVal, exists := c.Get("userID")
// 	if !exists {
// 		return 0, false
// 	}
// 	if uidFloat, ok := userIDVal.(float64); ok {
// 		return uint(uidFloat), true
// 	}
// 	if uidUint, ok := userIDVal.(uint); ok {
// 		return uidUint, true
// 	}
// 	return 0, false
// }

// // GetCart handles fetching the user's current shopping cart.
// func (h *Handler) GetCart(c *gin.Context) {
// 	userID, ok := getUserID(c)
// 	if !ok {
// 		response.Unauthorized(c, "Unauthorized access")
// 		return
// 	}

// 	cartResp, err := h.service.GetCart(c.Request.Context(), userID)
// 	if err != nil {
// 		response.InternalServerError(c, "Failed to fetch cart", err)
// 		return
// 	}

// 	response.Success(c, "Cart items retrieved successfully", cartResp)
// }

// // AddItem handles adding a product item to the user's cart.
// func (h *Handler) AddItem(c *gin.Context) {
// 	userID, ok := getUserID(c)
// 	if !ok {
// 		response.Unauthorized(c, "Unauthorized access")
// 		return
// 	}

// 	var input AddToCartInput
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		msg := validator.FormatValidationError(err)
// 		response.BadRequest(c, msg, err)
// 		return
// 	}

// 	item, err := h.service.AddToCart(c.Request.Context(), userID, input)
// 	if err != nil {
// 		if errors.Is(err, products.ErrProductNotFound) {
// 			response.NotFound(c, "Product not found")
// 			return
// 		}
// 		if errors.Is(err, ErrInsufficientStock) {
// 			response.BadRequest(c, "Requested quantity exceeds available stock", err)
// 			return
// 		}
// 		response.InternalServerError(c, "Failed to add item to cart", err)
// 		return
// 	}

// 	response.Created(c, "Item added to cart", item)
// }

// // UpdateItem handles updating quantity of an item in cart.
// func (h *Handler) UpdateItem(c *gin.Context) {
// 	userID, ok := getUserID(c)
// 	if !ok {
// 		response.Unauthorized(c, "Unauthorized access")
// 		return
// 	}

// 	idParam := c.Param("id")
// 	itemID, err := strconv.ParseUint(idParam, 10, 32)
// 	if err != nil {
// 		response.BadRequest(c, "Invalid cart item ID", err)
// 		return
// 	}

// 	var input UpdateCartItemInput
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		msg := validator.FormatValidationError(err)
// 		response.BadRequest(c, msg, err)
// 		return
// 	}

// 	item, err := h.service.UpdateItem(c.Request.Context(), userID, uint(itemID), input)
// 	if err != nil {
// 		if errors.Is(err, ErrCartItemNotFound) {
// 			response.NotFound(c, "Cart item not found")
// 			return
// 		}
// 		if errors.Is(err, ErrInsufficientStock) {
// 			response.BadRequest(c, "Requested quantity exceeds available stock", err)
// 			return
// 		}
// 		response.InternalServerError(c, "Failed to update cart item", err)
// 		return
// 	}

// 	response.Success(c, "Cart item updated successfully", item)
// }

// // RemoveItem handles deleting an item from cart.
// func (h *Handler) RemoveItem(c *gin.Context) {
// 	userID, ok := getUserID(c)
// 	if !ok {
// 		response.Unauthorized(c, "Unauthorized access")
// 		return
// 	}

// 	idParam := c.Param("id")
// 	itemID, err := strconv.ParseUint(idParam, 10, 32)
// 	if err != nil {
// 		response.BadRequest(c, "Invalid cart item ID", err)
// 		return
// 	}

// 	if err := h.service.RemoveItem(c.Request.Context(), userID, uint(itemID)); err != nil {
// 		if errors.Is(err, ErrCartItemNotFound) {
// 			response.NotFound(c, "Cart item not found")
// 			return
// 		}
// 		response.InternalServerError(c, "Failed to remove cart item", err)
// 		return
// 	}

// 	response.Success(c, "Cart item removed successfully", nil)
// }

// // ClearCart handles removing all items from cart.
// func (h *Handler) ClearCart(c *gin.Context) {
// 	userID, ok := getUserID(c)
// 	if !ok {
// 		response.Unauthorized(c, "Unauthorized access")
// 		return
// 	}

// 	if err := h.service.ClearCart(c.Request.Context(), userID); err != nil {
// 		response.InternalServerError(c, "Failed to clear cart", err)
// 		return
// 	}

// 	response.Success(c, "Cart cleared successfully", nil)
// }
