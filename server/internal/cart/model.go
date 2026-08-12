package cart

import (
	"time"

	"github.com/example/habeshamart/internal/products"
)

// CartItem represents an item in a user's shopping cart.
type CartItem struct {
	ID        uint             `gorm:"primaryKey" json:"id"`
	UserID    uint             `gorm:"index;not null" json:"user_id"`
	ProductID uint             `gorm:"index;not null" json:"product_id"`
	Quantity  int              `gorm:"not null;default:1" json:"quantity"`
	Product   products.Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	CreatedAt time.Time        `json:"created_at"`
	UpdatedAt time.Time        `json:"updated_at"`
}

// AddToCartInput payload for adding item to cart.
type AddToCartInput struct {
	ProductID uint `json:"product_id" binding:"required"`
	Quantity  int  `json:"quantity" binding:"required,gt=0"`
}

// UpdateCartItemInput payload for updating cart item quantity.
type UpdateCartItemInput struct {
	Quantity int `json:"quantity" binding:"required,gt=0"`
}

// CartResponse payload returned for cart queries.
type CartResponse struct {
	Items      []CartItem `json:"items"`
	TotalItems int        `json:"total_items"`
	TotalPrice float64    `json:"total_price"`
}
