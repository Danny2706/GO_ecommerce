package inventory

import "time"

// ChangeType represents the type of inventory change.
type ChangeType string

const (
	TypeRestock    ChangeType = "restock"
	TypeSale       ChangeType = "sale"
	TypeAdjustment ChangeType = "adjustment"
)

// InventoryLog tracks changes made to product inventory.
type InventoryLog struct {
	ID          uint       `gorm:"primaryKey" json:"id"`
	ProductID   uint       `gorm:"index;not null" json:"product_id"`
	StockChange int        `gorm:"not null" json:"stock_change"`
	Type        ChangeType `gorm:"size:50;not null" json:"type"`
	Reason      string     `gorm:"type:text" json:"reason"`
	CreatedAt   time.Time  `json:"created_at"`
}

// AdjustStockInput represents the payload for adjusting product stock.
type AdjustStockInput struct {
	ProductID   uint       `json:"product_id" binding:"required"`
	StockChange int        `json:"stock_change" binding:"required"`
	Type        ChangeType `json:"type" binding:"required"`
	Reason      string     `json:"reason" binding:"omitempty,max=500"`
}

// InventoryStatusItem represents the inventory status of a product.
type InventoryStatusItem struct {
	ID         uint   `json:"id"`
	Title      string `json:"title"`
	SKU        string `json:"sku"`
	Stock      int    `json:"stock"`
	CategoryID uint   `json:"category_id"`
	IsActive   bool   `json:"is_active"`
	Status     string `json:"status"`
}