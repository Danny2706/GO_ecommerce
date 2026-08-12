package auth

import "github.com/example/habeshamart/internal/users"

// RegisterInput represents payload to register a new user account.
type RegisterInput struct {
	Name     string `json:"name" binding:"required,min=2,max=255"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6,max=100"`
}

// LoginInput represents user login payload.
type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// AuthResponse represents payload returned upon successful auth.
type AuthResponse struct {
	Token string             `json:"token"`
	User  users.UserResponse `json:"user"`
}
