// package orders

// import (
// 	"github.com/example/habeshamart/internal/middleware"
// 	"github.com/gin-gonic/gin"
// 	"gorm.io/gorm"
// )

// // RegisterRoutes registers order processing endpoints (/api/v1/orders).
// func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB, jwtSecret string) {
// 	repo := NewRepository(db)
// 	service := NewService(repo)
// 	handler := NewHandler(service)

// 	ordersGroup := rg.Group("/orders")
// 	ordersGroup.Use(middleware.Authenticate(jwtSecret))
// 	{
// 		ordersGroup.POST("", handler.Create)
// 		ordersGroup.GET("", handler.List)
// 		ordersGroup.GET("/:id", handler.GetByID)
// 		ordersGroup.PATCH("/:id/status", handler.UpdateStatus)
// 	}
// }
