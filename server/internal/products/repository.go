// package products

// import (
// 	"context"

// 	"gorm.io/gorm"
// )

// // Repository defines data access contract for Products.
// type Repository interface {
// 	Create(ctx context.Context, product *Product) error
// 	GetByID(ctx context.Context, id uint) (*Product, error)
// 	List(ctx context.Context, filter ProductFilter) ([]Product, int64, error)
// 	Update(ctx context.Context, product *Product) error
// 	Delete(ctx context.Context, id uint) error
// }

// type repository struct {
// 	db *gorm.DB
// }

// // NewRepository creates a new product database repository instance.
// func NewRepository(db *gorm.DB) Repository {
// 	return &repository{db: db}
// }

// func (r *repository) Create(ctx context.Context, product *Product) error {
// 	return r.db.WithContext(ctx).Create(product).Error
// }

// func (r *repository) GetByID(ctx context.Context, id uint) (*Product, error) {
// 	var product Product
// 	if err := r.db.WithContext(ctx).First(&product, id).Error; err != nil {
// 		return nil, err
// 	}
// 	return &product, nil
// }

// func (r *repository) List(ctx context.Context, filter ProductFilter) ([]Product, int64, error) {
// 	var products []Product
// 	var total int64

// 	db := r.db.WithContext(ctx).Model(&Product{})

// 	if filter.CategoryID > 0 {
// 		db = db.Where("category_id = ?", filter.CategoryID)
// 	}

// 	if filter.Search != "" {
// 		db = db.Where("title ILIKE ? OR description ILIKE ?", "%"+filter.Search+"%", "%"+filter.Search+"%")
// 	}

// 	if err := db.Count(&total).Error; err != nil {
// 		return nil, 0, err
// 	}

// 	offset := (filter.Page - 1) * filter.PageSize
// 	if err := db.Limit(filter.PageSize).Offset(offset).Find(&products).Error; err != nil {
// 		return nil, 0, err
// 	}

// 	return products, total, nil
// }

// func (r *repository) Update(ctx context.Context, product *Product) error {
// 	return r.db.WithContext(ctx).Save(product).Error
// }

// func (r *repository) Delete(ctx context.Context, id uint) error {
// 	return r.db.WithContext(ctx).Delete(&Product{}, id).Error
// }
