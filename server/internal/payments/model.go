package payments

import (
	"time"

	"gorm.io/gorm"
)

type PaymentStatus string

const (
	PaymentPending   PaymentStatus = "pending"
	PaymentCompleted PaymentStatus = "completed"
	PaymentFailed    PaymentStatus = "failed"
)

// Payment represents a payment record.
type Payment struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	OrderID       uint           `gorm:"index;not null" json:"order_id"`
	UserID        uint           `gorm:"index;not null" json:"user_id"`
	Amount        float64        `gorm:"type:numeric(10,2);not null" json:"amount"`
	Provider      string         `gorm:"size:50;not null" json:"provider"` // stripe, chapa, telebirr
	Status        PaymentStatus  `gorm:"size:50;default:'pending';not null" json:"status"`
	TransactionID string         `gorm:"size:255;uniqueIndex" json:"transaction_id"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

// CheckoutInput payload to initiate payment.
type CheckoutInput struct {
	OrderID  uint   `json:"order_id" binding:"required"`
	Provider string `json:"provider" binding:"required"` // stripe, chapa, telebirr
}

// WebhookInput payload for payment callback webhook.
type WebhookInput struct {
	TransactionID string        `json:"transaction_id" binding:"required"`
	OrderID       uint          `json:"order_id" binding:"required"`
	Status        PaymentStatus `json:"status" binding:"required"`
}
