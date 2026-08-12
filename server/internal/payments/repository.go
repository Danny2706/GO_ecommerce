package payments

import (
	"context"

	"gorm.io/gorm"
)

// Repository defines data access methods for payments.
type Repository interface {
	Create(ctx context.Context, payment *Payment) error
	GetByID(ctx context.Context, id uint) (*Payment, error)
	GetByOrderID(ctx context.Context, orderID uint) (*Payment, error)
	GetByTransactionID(ctx context.Context, txID string) (*Payment, error)
	UpdateStatus(ctx context.Context, id uint, status PaymentStatus, txID string) error
}

type repository struct {
	db *gorm.DB
}

// NewRepository creates a new payment database repository instance.
func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, payment *Payment) error {
	return r.db.WithContext(ctx).Create(payment).Error
}

func (r *repository) GetByID(ctx context.Context, id uint) (*Payment, error) {
	var payment Payment
	if err := r.db.WithContext(ctx).First(&payment, id).Error; err != nil {
		return nil, err
	}
	return &payment, nil
}

func (r *repository) GetByOrderID(ctx context.Context, orderID uint) (*Payment, error) {
	var payment Payment
	if err := r.db.WithContext(ctx).Where("order_id = ?", orderID).First(&payment).Error; err != nil {
		return nil, err
	}
	return &payment, nil
}

func (r *repository) GetByTransactionID(ctx context.Context, txID string) (*Payment, error) {
	var payment Payment
	if err := r.db.WithContext(ctx).Where("transaction_id = ?", txID).First(&payment).Error; err != nil {
		return nil, err
	}
	return &payment, nil
}

func (r *repository) UpdateStatus(ctx context.Context, id uint, status PaymentStatus, txID string) error {
	updates := map[string]interface{}{"status": status}
	if txID != "" {
		updates["transaction_id"] = txID
	}
	return r.db.WithContext(ctx).Model(&Payment{}).Where("id = ?", id).Updates(updates).Error
}
