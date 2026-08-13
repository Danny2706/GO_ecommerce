package inventory

import (
	"context"

	"github.com/example/habeshamart/internal/products"
)

// Service defines inventory management business logic.
type Service interface {
	GetInventoryStatus(ctx context.Context) ([]InventoryStatusItem, error)
	AdjustStock(ctx context.Context, input AdjustStockInput) (*InventoryLog, error)
}

type service struct {
	repo        Repository
	productRepo products.Repository
}

// NewService creates a new Inventory Service instance.
func NewService(
	repo Repository,
	productRepo products.Repository,
) Service {
	return &service{
		repo:        repo,
		productRepo: productRepo,
	}
}

// GetInventoryStatus returns inventory status for all products.
func (s *service) GetInventoryStatus(
	ctx context.Context,
) ([]InventoryStatusItem, error) {

	productList, err := s.repo.GetAllProducts(ctx)
	if err != nil {
		return nil, err
	}

	items := make([]InventoryStatusItem, 0, len(productList))

	for _, product := range productList {

		status := getInventoryStatus(product.Stock)

		items = append(items, InventoryStatusItem{
			ID:         product.ID,
			Title:      product.Title,
			SKU:        product.SKU,
			Stock:      product.Stock,
			CategoryID: product.CategoryID,
			IsActive:   product.IsActive,
			Status:     status,
		})
	}

	return items, nil
}

// getInventoryStatus determines the current inventory status.
func getInventoryStatus(stock int) string {
	switch {
	case stock <= 0:
		return "out_of_stock"

	case stock <= 10:
		return "low_stock"

	default:
		return "in_stock"
	}
}

// AdjustStock adjusts a product's stock and creates an inventory log.
func (s *service) AdjustStock(
	ctx context.Context,
	input AdjustStockInput,
) (*InventoryLog, error) {

	// Make sure the product exists.
	_, err := s.productRepo.GetByID(ctx, input.ProductID)
	if err != nil {
		return nil, products.ErrProductNotFound
	}

	// Prevent stock from becoming negative for sales/adjustments.
	if input.Type == TypeSale && input.StockChange > 0 {
		input.StockChange = -input.StockChange
	}

	log := &InventoryLog{
		ProductID:   input.ProductID,
		StockChange: input.StockChange,
		Type:        input.Type,
		Reason:      input.Reason,
	}

	if err := s.repo.AdjustStockTx(ctx, log); err != nil {
		return nil, err
	}

	return log, nil
}