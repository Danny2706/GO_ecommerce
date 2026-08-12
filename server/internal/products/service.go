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
	ListProducts(ctx context.Context, filter ProductFilter) ([]Product, int64, error)
	UpdateProduct(ctx context.Context, id uint, input UpdateProductInput) (*Product, error)
	DeleteProduct(ctx context.Context, id uint) error
}

type service struct {
	repo Repository
}

// NewService creates a new Product Service instance.
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

func (s *service) ListProducts(ctx context.Context, filter ProductFilter) ([]Product, int64, error) {
	if filter.Page < 1 {
		filter.Page = 1
	}
	if filter.PageSize < 1 || filter.PageSize > 100 {
		filter.PageSize = 20
	}

	return s.repo.List(ctx, filter)
}

func (s *service) UpdateProduct(ctx context.Context, id uint, input UpdateProductInput) (*Product, error) {
	product, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, ErrProductNotFound
	}

	if input.Title != "" {
		product.Title = input.Title
	}
	if input.Description != "" {
		product.Description = input.Description
	}
	if input.SKU != "" {
		product.SKU = input.SKU
	}
	if input.Price != nil {
		product.Price = *input.Price
	}
	if input.Stock != nil {
		product.Stock = *input.Stock
	}
	if input.CategoryID != nil {
		product.CategoryID = *input.CategoryID
	}
	if input.IsActive != nil {
		product.IsActive = *input.IsActive
	}

	if err := s.repo.Update(ctx, product); err != nil {
		return nil, err
	}

	return product, nil
}

func (s *service) DeleteProduct(ctx context.Context, id uint) error {
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return ErrProductNotFound
	}
	return s.repo.Delete(ctx, id)
}
