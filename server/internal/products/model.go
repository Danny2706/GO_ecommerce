package products

import (
	"time"

	"gorm.io/gorm"
)

// Product represents an e-commerce product item stored in PostgreSQL.
type Product struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `gorm:"size:255;not null" json:"title"`
	Description string         `gorm:"type:text" json:"description"`
	SKU         string         `gorm:"size:100;uniqueIndex;not null" json:"sku"`
	Price       float64        `gorm:"type:numeric(10,2);not null" json:"price"`
	Stock       int            `gorm:"default:0;not null" json:"stock"`
	CategoryID  uint           `gorm:"index" json:"category_id"`
	IsActive    bool           `gorm:"default:true" json:"is_active"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// CreateProductInput represents payload required to create a new product.
type CreateProductInput struct {
	Title       string  `json:"title" binding:"required,min=3,max=255"`
	Description string  `json:"description" binding:"max=2000"`
	SKU         string  `json:"sku" binding:"required"`
	Price       float64 `json:"price" binding:"required,gt=0"`
	Stock       int     `json:"stock" binding:"required,gte=0"`
	CategoryID  uint    `json:"category_id" binding:"required"`
}

// UpdateProductInput represents payload required to update an existing product.
type UpdateProductInput struct {
	Title       string   `json:"title" binding:"omitempty,min=3,max=255"`
	Description string   `json:"description" binding:"omitempty,max=2000"`
	SKU         string   `json:"sku" binding:"omitempty"`
	Price       *float64 `json:"price" binding:"omitempty,gt=0"`
	Stock       *int     `json:"stock" binding:"omitempty,gte=0"`
	CategoryID  *uint    `json:"category_id" binding:"omitempty"`
	IsActive    *bool    `json:"is_active" binding:"omitempty"`
}

// ProductFilter represents search/pagination filter criteria.
type ProductFilter struct {
	CategoryID uint
	Search     string
	Page       int
	PageSize   int
}
