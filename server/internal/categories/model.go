package categories

import (
	"time"

	"gorm.io/gorm"
)

// Category represents a product category hierarchy.
type Category struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Name        string         `gorm:"size:255;not null" json:"name"`
	Slug        string         `gorm:"size:255;uniqueIndex;not null" json:"slug"`
	Description string         `gorm:"type:text" json:"description"`
	ParentID    *uint          `gorm:"index" json:"parent_id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// CreateCategoryInput represents payload to create a category.
type CreateCategoryInput struct {
	Name        string `json:"name" binding:"required,min=2,max=255"`
	Slug        string `json:"slug" binding:"required"`
	Description string `json:"description" binding:"max=1000"`
	ParentID    *uint  `json:"parent_id"`
}

// UpdateCategoryInput represents payload to update a category.
type UpdateCategoryInput struct {
	Name        string `json:"name" binding:"omitempty,min=2,max=255"`
	Slug        string `json:"slug" binding:"omitempty"`
	Description string `json:"description" binding:"omitempty,max=1000"`
	ParentID    *uint  `json:"parent_id"`
}
