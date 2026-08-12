package cart

import (
	"context"
	"errors"

	"github.com/example/habeshamart/internal/products"
)

var (
	ErrCartItemNotFound = errors.New("cart item not found")
	ErrInsufficientStock = errors.New("insufficient product stock")
)

// Service defines business logic methods for cart management.
type Service interface {
	GetCart(ctx context.Context, userID uint) (*CartResponse, error)
	AddToCart(ctx context.Context, userID uint, input AddToCartInput) (*CartItem, error)
	UpdateItem(ctx context.Context, userID uint, itemID uint, input UpdateCartItemInput) (*CartItem, error)
	RemoveItem(ctx context.Context, userID uint, itemID uint) error
	ClearCart(ctx context.Context, userID uint) error
}

type service struct {
	repo        Repository
	productRepo products.Repository
}

// NewService creates a new Cart Service instance.
func NewService(repo Repository, productRepo products.Repository) Service {
	return &service{repo: repo, productRepo: productRepo}
}

func (s *service) GetCart(ctx context.Context, userID uint) (*CartResponse, error) {
	items, err := s.repo.GetByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	var totalItems int
	var totalPrice float64

	for _, item := range items {
		totalItems += item.Quantity
		totalPrice += float64(item.Quantity) * item.Product.Price
	}

	return &CartResponse{
		Items:      items,
		TotalItems: totalItems,
		TotalPrice: totalPrice,
	}, nil
}

func (s *service) AddToCart(ctx context.Context, userID uint, input AddToCartInput) (*CartItem, error) {
	product, err := s.productRepo.GetByID(ctx, input.ProductID)
	if err != nil {
		return nil, products.ErrProductNotFound
	}

	if product.Stock < input.Quantity {
		return nil, ErrInsufficientStock
	}

	existingItem, err := s.repo.GetItem(ctx, userID, input.ProductID)
	if err == nil && existingItem != nil {
		newQty := existingItem.Quantity + input.Quantity
		if product.Stock < newQty {
			return nil, ErrInsufficientStock
		}
		existingItem.Quantity = newQty
		if err := s.repo.UpdateItem(ctx, existingItem); err != nil {
			return nil, err
		}
		existingItem.Product = *product
		return existingItem, nil
	}

	item := &CartItem{
		UserID:    userID,
		ProductID: input.ProductID,
		Quantity:  input.Quantity,
	}

	if err := s.repo.AddItem(ctx, item); err != nil {
		return nil, err
	}
	item.Product = *product
	return item, nil
}

func (s *service) UpdateItem(ctx context.Context, userID uint, itemID uint, input UpdateCartItemInput) (*CartItem, error) {
	item, err := s.repo.GetByID(ctx, itemID)
	if err != nil || item.UserID != userID {
		return nil, ErrCartItemNotFound
	}

	product, err := s.productRepo.GetByID(ctx, item.ProductID)
	if err != nil {
		return nil, products.ErrProductNotFound
	}

	if product.Stock < input.Quantity {
		return nil, ErrInsufficientStock
	}

	item.Quantity = input.Quantity
	if err := s.repo.UpdateItem(ctx, item); err != nil {
		return nil, err
	}

	item.Product = *product
	return item, nil
}

func (s *service) RemoveItem(ctx context.Context, userID uint, itemID uint) error {
	item, err := s.repo.GetByID(ctx, itemID)
	if err != nil || item.UserID != userID {
		return ErrCartItemNotFound
	}
	return s.repo.DeleteItem(ctx, itemID)
}

func (s *service) ClearCart(ctx context.Context, userID uint) error {
	return s.repo.ClearCart(ctx, userID)
}
