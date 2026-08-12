// package orders

// import (
// 	"time"

// 	"github.com/example/habeshamart/internal/products"
// 	"gorm.io/gorm"
// )

// type OrderStatus string

// const (
// 	StatusPending   OrderStatus = "pending"
// 	StatusPaid      OrderStatus = "paid"
// 	StatusShipped   OrderStatus = "shipped"
// 	StatusDelivered OrderStatus = "delivered"
// 	StatusCancelled OrderStatus = "cancelled"
// )

// // Order represents an e-commerce order.
// type Order struct {
// 	ID              uint           `gorm:"primaryKey" json:"id"`
// 	UserID          uint           `gorm:"index;not null" json:"user_id"`
// 	TotalAmount     float64        `gorm:"type:numeric(10,2);not null" json:"total_amount"`
// 	Status          OrderStatus    `gorm:"size:50;default:'pending';not null" json:"status"`
// 	ShippingAddress string         `gorm:"type:text;not null" json:"shipping_address"`
// 	PaymentStatus   string         `gorm:"size:50;default:'pending';not null" json:"payment_status"`
// 	Items           []OrderItem    `gorm:"foreignKey:OrderID" json:"items"`
// 	CreatedAt       time.Time      `json:"created_at"`
// 	UpdatedAt       time.Time      `json:"updated_at"`
// 	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
// }

// // OrderItem represents an individual product line in an order.
// type OrderItem struct {
// 	ID        uint             `gorm:"primaryKey" json:"id"`
// 	OrderID   uint             `gorm:"index;not null" json:"order_id"`
// 	ProductID uint             `gorm:"index;not null" json:"product_id"`
// 	Product   products.Product `gorm:"foreignKey:ProductID" json:"product,omitempty"`
// 	Quantity  int              `gorm:"not null" json:"quantity"`
// 	Price     float64          `gorm:"type:numeric(10,2);not null" json:"price"`
// 	CreatedAt time.Time        `json:"created_at"`
// }

// // CreateOrderInput represents payload required to place an order.
// type CreateOrderInput struct {
// 	ShippingAddress string `json:"shipping_address" binding:"required,min=5"`
// }

// // UpdateOrderStatusInput represents payload to update order status.
// type UpdateOrderStatusInput struct {
// 	Status OrderStatus `json:"status" binding:"required"`
// }
