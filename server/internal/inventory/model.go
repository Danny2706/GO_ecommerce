// package inventory

// import "time"

// type ChangeType string

// const (
// 	TypeRestock    ChangeType = "restock"
// 	TypeSale       ChangeType = "sale"
// 	TypeAdjustment ChangeType = "adjustment"
// )

// // InventoryLog tracks changes in product inventory.
// type InventoryLog struct {
// 	ID          uint       `gorm:"primaryKey" json:"id"`
// 	ProductID   uint       `gorm:"index;not null" json:"product_id"`
// 	StockChange int        `gorm:"not null" json:"stock_change"`
// 	Type        ChangeType `gorm:"size:50;not null" json:"type"`
// 	Reason      string     `gorm:"type:text" json:"reason"`
// 	CreatedAt   time.Time  `json:"created_at"`
// }

// // AdjustStockInput payload for adjusting stock.
// type AdjustStockInput struct {
// 	ProductID   uint       `json:"product_id" binding:"required"`
// 	StockChange int        `json:"stock_change" binding:"required"`
// 	Type        ChangeType `json:"type" binding:"required"`
// 	Reason      string     `json:"reason" binding:"omitempty,max=500"`
// }
