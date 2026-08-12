// package cart

// import (
// 	"context"

// 	"gorm.io/gorm"
// )

// // Repository defines data access contract for Cart items.
// type Repository interface {
// 	GetByUserID(ctx context.Context, userID uint) ([]CartItem, error)
// 	GetItem(ctx context.Context, userID, productID uint) (*CartItem, error)
// 	GetByID(ctx context.Context, id uint) (*CartItem, error)
// 	AddItem(ctx context.Context, item *CartItem) error
// 	UpdateItem(ctx context.Context, item *CartItem) error
// 	DeleteItem(ctx context.Context, id uint) error
// 	ClearCart(ctx context.Context, userID uint) error
// }

// type repository struct {
// 	db *gorm.DB
// }

// // NewRepository creates a new cart database repository instance.
// func NewRepository(db *gorm.DB) Repository {
// 	return &repository{db: db}
// }

// func (r *repository) GetByUserID(ctx context.Context, userID uint) ([]CartItem, error) {
// 	var items []CartItem
// 	if err := r.db.WithContext(ctx).Preload("Product").Where("user_id = ?", userID).Find(&items).Error; err != nil {
// 		return nil, err
// 	}
// 	return items, nil
// }

// func (r *repository) GetItem(ctx context.Context, userID, productID uint) (*CartItem, error) {
// 	var item CartItem
// 	if err := r.db.WithContext(ctx).Where("user_id = ? AND product_id = ?", userID, productID).First(&item).Error; err != nil {
// 		return nil, err
// 	}
// 	return &item, nil
// }

// func (r *repository) GetByID(ctx context.Context, id uint) (*CartItem, error) {
// 	var item CartItem
// 	if err := r.db.WithContext(ctx).First(&item, id).Error; err != nil {
// 		return nil, err
// 	}
// 	return &item, nil
// }

// func (r *repository) AddItem(ctx context.Context, item *CartItem) error {
// 	return r.db.WithContext(ctx).Create(item).Error
// }

// func (r *repository) UpdateItem(ctx context.Context, item *CartItem) error {
// 	return r.db.WithContext(ctx).Save(item).Error
// }

// func (r *repository) DeleteItem(ctx context.Context, id uint) error {
// 	return r.db.WithContext(ctx).Delete(&CartItem{}, id).Error
// }

// func (r *repository) ClearCart(ctx context.Context, userID uint) error {
// 	return r.db.WithContext(ctx).Where("user_id = ?", userID).Delete(&CartItem{}).Error
// }
