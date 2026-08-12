package orders

import (
	"context"

	"github.com/example/habeshamart/internal/cart"
	"github.com/example/habeshamart/internal/products"
	"gorm.io/gorm"
)

// Repository defines data access contract for Orders.
type Repository interface {
	CreateOrderTx(ctx context.Context, userID uint, shippingAddress string) (*Order, error)
	GetByID(ctx context.Context, id uint) (*Order, error)
	ListByUserID(ctx context.Context, userID uint) ([]Order, error)
	UpdateStatus(ctx context.Context, id uint, status OrderStatus) (*Order, error)
}

type repository struct {
	db *gorm.DB
}

// NewRepository creates a new order database repository instance.
func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) CreateOrderTx(ctx context.Context, userID uint, shippingAddress string) (*Order, error) {
	var order Order

	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// 1. Fetch user's cart items
		var cartItems []cart.CartItem
		if err := tx.Preload("Product").Where("user_id = ?", userID).Find(&cartItems).Error; err != nil {
			return err
		}

		if len(cartItems) == 0 {
			return gorm.ErrRecordNotFound
		}

		var totalAmount float64
		var orderItems []OrderItem

		// 2. Validate stock & accumulate items
		for _, ci := range cartItems {
			if ci.Product.Stock < ci.Quantity {
				return gorm.ErrInvalidData
			}

			lineTotal := float64(ci.Quantity) * ci.Product.Price
			totalAmount += lineTotal

			// Deduct product inventory stock
			if err := tx.Model(&products.Product{}).Where("id = ?", ci.ProductID).
				Update("stock", gorm.Expr("stock - ?", ci.Quantity)).Error; err != nil {
				return err
			}

			orderItems = append(orderItems, OrderItem{
				ProductID: ci.ProductID,
				Quantity:  ci.Quantity,
				Price:     ci.Product.Price,
			})
		}

		// 3. Create Order
		order = Order{
			UserID:          userID,
			TotalAmount:     totalAmount,
			Status:          StatusPending,
			ShippingAddress: shippingAddress,
			PaymentStatus:   "pending",
			Items:           orderItems,
		}

		if err := tx.Create(&order).Error; err != nil {
			return err
		}

		// 4. Clear user's cart
		if err := tx.Where("user_id = ?", userID).Delete(&cart.CartItem{}).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return &order, nil
}

func (r *repository) GetByID(ctx context.Context, id uint) (*Order, error) {
	var order Order
	if err := r.db.WithContext(ctx).Preload("Items.Product").First(&order, id).Error; err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *repository) ListByUserID(ctx context.Context, userID uint) ([]Order, error) {
	var orders []Order
	if err := r.db.WithContext(ctx).Preload("Items.Product").Where("user_id = ?", userID).Order("created_at DESC").Find(&orders).Error; err != nil {
		return nil, err
	}
	return orders, nil
}

func (r *repository) UpdateStatus(ctx context.Context, id uint, status OrderStatus) (*Order, error) {
	var order Order
	if err := r.db.WithContext(ctx).First(&order, id).Error; err != nil {
		return nil, err
	}

	order.Status = status
	if err := r.db.WithContext(ctx).Save(&order).Error; err != nil {
		return nil, err
	}

	return &order, nil
}
