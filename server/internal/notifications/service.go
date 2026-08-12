package notifications

import (
	"context"
	"errors"
)

var (
	ErrNotificationNotFound = errors.New("notification not found")
)

// Service defines notification business logic.
type Service interface {
	GetUserNotifications(ctx context.Context, userID uint) ([]Notification, error)
	MarkAsRead(ctx context.Context, id uint, userID uint) error
}

type service struct {
	repo Repository
}

// NewService creates a new notification service instance.
func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetUserNotifications(ctx context.Context, userID uint) ([]Notification, error) {
	return s.repo.ListByUserID(ctx, userID)
}

func (s *service) MarkAsRead(ctx context.Context, id uint, userID uint) error {
	return s.repo.MarkAsRead(ctx, id, userID)
}
