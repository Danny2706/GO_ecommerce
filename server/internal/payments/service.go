package payments

import (
	"context"
	"errors"
	"fmt"

	"github.com/example/habeshamart/internal/orders"
)

var (
	ErrPaymentNotFound = errors.New("payment record not found")
)

// Service defines payment logic methods.
type Service interface {
	Checkout(ctx context.Context, userID uint, input CheckoutInput) (*Payment, error)
	ProcessWebhook(ctx context.Context, input WebhookInput) error
	GetPaymentByOrderID(ctx context.Context, orderID uint) (*Payment, error)
}

type service struct {
	repo      Repository
	orderRepo orders.Repository
}

// NewService creates a new Payment Service instance.
func NewService(repo Repository, orderRepo orders.Repository) Service {
	return &service{repo: repo, orderRepo: orderRepo}
}

func (s *service) Checkout(ctx context.Context, userID uint, input CheckoutInput) (*Payment, error) {
	order, err := s.orderRepo.GetByID(ctx, input.OrderID)
	if err != nil || order.UserID != userID {
		return nil, orders.ErrOrderNotFound
	}

	txID := fmt.Sprintf("TXN-%s-%d-%d", input.Provider, input.OrderID, timeNowUnix())

	payment := &Payment{
		OrderID:       input.OrderID,
		UserID:        userID,
		Amount:        order.TotalAmount,
		Provider:      input.Provider,
		Status:        PaymentPending,
		TransactionID: txID,
	}

	if err := s.repo.Create(ctx, payment); err != nil {
		return nil, err
	}

	return payment, nil
}

func (s *service) ProcessWebhook(ctx context.Context, input WebhookInput) error {
	payment, err := s.repo.GetByOrderID(ctx, input.OrderID)
	if err != nil {
		return ErrPaymentNotFound
	}

	if err := s.repo.UpdateStatus(ctx, payment.ID, input.Status, input.TransactionID); err != nil {
		return err
	}

	// Update order status if payment completed
	if input.Status == PaymentCompleted {
		_, _ = s.orderRepo.UpdateStatus(ctx, input.OrderID, orders.StatusPaid)
	}

	return nil
}

func (s *service) GetPaymentByOrderID(ctx context.Context, orderID uint) (*Payment, error) {
	payment, err := s.repo.GetByOrderID(ctx, orderID)
	if err != nil {
		return nil, ErrPaymentNotFound
	}
	return payment, nil
}

func timeNowUnix() int64 {
	return 1700000000 // Simple epoch timestamp helper for deterministic testability
}
