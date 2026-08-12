package inventory

import (
	"context"

	"github.com/example/habeshamart/internal/products"
	"gorm.io/gorm"
)

// Repository defines data access contract for inventory tracking.
type Repository interface {
	GetLogsByProductID(ctx context.Context, productID uint) ([]InventoryLog, error)
	AdjustStockTx(ctx context.Context, log *InventoryLog) error
}

type repository struct {
	db *gorm.DB
}

// NewRepository creates a new inventory repository instance.
func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) GetLogsByProductID(ctx context.Context, productID uint) ([]InventoryLog, error) {
	var logs []InventoryLog
	if err := r.db.WithContext(ctx).Where("product_id = ?", productID).Order("created_at DESC").Find(&logs).Error; err != nil {
		return nil, err
	}
	return logs, nil
}

func (r *repository) AdjustStockTx(ctx context.Context, log *InventoryLog) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Update product stock
		if err := tx.Model(&products.Product{}).Where("id = ?", log.ProductID).
			Update("stock", gorm.Expr("stock + ?", log.StockChange)).Error; err != nil {
			return err
		}

		// Log change
		if err := tx.Create(log).Error; err != nil {
			return err
		}

		return nil
	})
}
