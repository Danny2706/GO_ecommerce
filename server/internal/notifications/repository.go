package notifications

import (
	"context"

	"gorm.io/gorm"
)

// Repository defines data access contract for notifications.
type Repository interface {
	Create(ctx context.Context, notification *Notification) error
	ListByUserID(ctx context.Context, userID uint) ([]Notification, error)
	MarkAsRead(ctx context.Context, id uint, userID uint) error
}

type repository struct {
	db *gorm.DB
}

// NewRepository creates a new notification repository instance.
func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, notification *Notification) error {
	return r.db.WithContext(ctx).Create(notification).Error
}

func (r *repository) ListByUserID(ctx context.Context, userID uint) ([]Notification, error) {
	var list []Notification
	if err := r.db.WithContext(ctx).Where("user_id = ?", userID).Order("created_at DESC").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *repository) MarkAsRead(ctx context.Context, id uint, userID uint) error {
	return r.db.WithContext(ctx).Model(&Notification{}).Where("id = ? AND user_id = ?", id, userID).Update("is_read", true).Error
}
