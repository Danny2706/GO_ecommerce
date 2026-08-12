package products

import (
	"context"
	"errors"
)

var (
	ErrProductNotFound = errors.New("product not found")
)

// Service defines business logic methods for products.
type Service interface {
	CreateProduct(ctx context.Context, input CreateProductInput) (*Product, error)
	GetProductByID(ctx context.Context, id uint) (*Product, error)
	ListProducts(ctx context.Context, page, pageSize int) ([]Product, int64, error)
}

type service struct {
	repo Repository
}

// NewService creates a new Product Service instance.
// Go Concept: Dependency Injection via struct fields holding interface references.
func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateProduct(ctx context.Context, input CreateProductInput) (*Product, error) {
	product := &Product{
		Title:       input.Title,
		Description: input.Description,
		SKU:         input.SKU,
		Price:       input.Price,
		Stock:       input.Stock,
		CategoryID:  input.CategoryID,
		IsActive:    true,
	}

	if err := s.repo.Create(ctx, product); err != nil {
		return nil, err
	}

	return product, nil
}

func (s *service) GetProductByID(ctx context.Context, id uint) (*Product, error) {
	product, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, ErrProductNotFound
	}
	return product, nil
}

func (s *service) ListProducts(ctx context.Context, page, pageSize int) ([]Product, int64, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	return s.repo.List(ctx, pageSize, offset)
}
