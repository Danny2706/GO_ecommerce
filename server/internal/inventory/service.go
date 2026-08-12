package inventory

import (
	"context"

	"github.com/example/habeshamart/internal/products"
)

// Service defines inventory management business logic.
type Service interface {
	GetInventoryStatus(ctx context.Context, productID uint) (*products.Product, []InventoryLog, error)
	AdjustStock(ctx context.Context, input AdjustStockInput) (*InventoryLog, error)
}

type service struct {
	repo        Repository
	productRepo products.Repository
}

// NewService creates a new Inventory Service instance.
func NewService(repo Repository, productRepo products.Repository) Service {
	return &service{repo: repo, productRepo: productRepo}
}

func (s *service) GetInventoryStatus(ctx context.Context, productID uint) (*products.Product, []InventoryLog, error) {
	product, err := s.productRepo.GetByID(ctx, productID)
	if err != nil {
		return nil, nil, products.ErrProductNotFound
	}

	logs, err := s.repo.GetLogsByProductID(ctx, productID)
	if err != nil {
		return nil, nil, err
	}

	return product, logs, nil
}

func (s *service) AdjustStock(ctx context.Context, input AdjustStockInput) (*InventoryLog, error) {
	_, err := s.productRepo.GetByID(ctx, input.ProductID)
	if err != nil {
		return nil, products.ErrProductNotFound
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
