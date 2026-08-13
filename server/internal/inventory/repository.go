package inventory

import (
	"context"

	"github.com/example/habeshamart/internal/products"
	"gorm.io/gorm"
)

// Repository defines data access operations for inventory.
type Repository interface {
	GetLogsByProductID(ctx context.Context, productID uint) ([]InventoryLog, error)
	AdjustStockTx(ctx context.Context, log *InventoryLog) error
	GetAllProducts(ctx context.Context) ([]products.Product, error)
}

type repository struct {
	db *gorm.DB
}

// NewRepository creates a new inventory repository.
func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

// GetLogsByProductID returns inventory logs for a specific product.
func (r *repository) GetLogsByProductID(
	ctx context.Context,
	productID uint,
) ([]InventoryLog, error) {
	var logs []InventoryLog

	if err := r.db.
		WithContext(ctx).
		Where("product_id = ?", productID).
		Order("created_at DESC").
		Find(&logs).Error; err != nil {
		return nil, err
	}

	return logs, nil
}

// GetAllProducts returns all products for inventory status.
func (r *repository) GetAllProducts(
	ctx context.Context,
) ([]products.Product, error) {
	var productsList []products.Product

	if err := r.db.
		WithContext(ctx).
		Order("id ASC").
		Find(&productsList).Error; err != nil {
		return nil, err
	}

	return productsList, nil
}

// AdjustStockTx updates product stock and creates an inventory log
// inside the same database transaction.
func (r *repository) AdjustStockTx(
	ctx context.Context,
	log *InventoryLog,
) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {

		// Update product stock.
		if err := tx.
			Model(&products.Product{}).
			Where("id = ?", log.ProductID).
			Update(
				"stock",
				gorm.Expr("stock + ?", log.StockChange),
			).Error; err != nil {
			return err
		}

		// Create inventory log.
		if err := tx.Create(log).Error; err != nil {
			return err
		}

		return nil
	})
}