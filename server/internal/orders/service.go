package orders

import (
	"context"
	"errors"
)

var (
	ErrOrderNotFound = errors.New("order not found")
	ErrEmptyCart     = errors.New("cart is empty")
)

// Service defines business logic for processing orders.
type Service interface {
	CreateOrder(ctx context.Context, userID uint, input CreateOrderInput) (*Order, error)
	GetOrderByID(ctx context.Context, id uint) (*Order, error)
	ListUserOrders(ctx context.Context, userID uint) ([]Order, error)
	UpdateOrderStatus(ctx context.Context, id uint, status OrderStatus) (*Order, error)
}

type service struct {
	repo Repository
}

// NewService creates a new order service instance.
func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateOrder(ctx context.Context, userID uint, input CreateOrderInput) (*Order, error) {
	order, err := s.repo.CreateOrderTx(ctx, userID, input.ShippingAddress)
	if err != nil {
		return nil, err
	}
	return order, nil
}

func (s *service) GetOrderByID(ctx context.Context, id uint) (*Order, error) {
	order, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, ErrOrderNotFound
	}
	return order, nil
}

func (s *service) ListUserOrders(ctx context.Context, userID uint) ([]Order, error) {
	return s.repo.ListByUserID(ctx, userID)
}

func (s *service) UpdateOrderStatus(ctx context.Context, id uint, status OrderStatus) (*Order, error) {
	order, err := s.repo.UpdateStatus(ctx, id, status)
	if err != nil {
		return nil, ErrOrderNotFound
	}
	return order, nil
}
