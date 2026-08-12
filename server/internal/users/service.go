package users

import (
	"context"
	"errors"
)

var (
	ErrUserNotFound = errors.New("user not found")
)

// Service defines user business logic methods.
type Service interface {
	GetProfile(ctx context.Context, userID uint) (*UserResponse, error)
	UpdateProfile(ctx context.Context, userID uint, input UpdateProfileInput) (*UserResponse, error)
}

type service struct {
	repo Repository
}

// NewService creates a new user service instance.
func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetProfile(ctx context.Context, userID uint) (*UserResponse, error) {
	user, err := s.repo.GetByID(ctx, userID)
	if err != nil {
		return nil, ErrUserNotFound
	}
	resp := user.ToResponse()
	return &resp, nil
}

func (s *service) UpdateProfile(ctx context.Context, userID uint, input UpdateProfileInput) (*UserResponse, error) {
	user, err := s.repo.GetByID(ctx, userID)
	if err != nil {
		return nil, ErrUserNotFound
	}

	if input.Name != "" {
		user.Name = input.Name
	}
	if input.Email != "" {
		user.Email = input.Email
	}

	if err := s.repo.Update(ctx, user); err != nil {
		return nil, err
	}

	resp := user.ToResponse()
	return &resp, nil
}
