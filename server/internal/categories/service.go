package categories

import (
	"context"
	"errors"
)

var (
	ErrCategoryNotFound = errors.New("category not found")
)

// Service defines business logic for product categories.
type Service interface {
	CreateCategory(ctx context.Context, input CreateCategoryInput) (*Category, error)
	GetCategoryByID(ctx context.Context, id uint) (*Category, error)
	ListCategories(ctx context.Context) ([]Category, error)
	UpdateCategory(ctx context.Context, id uint, input UpdateCategoryInput) (*Category, error)
	DeleteCategory(ctx context.Context, id uint) error
}

type service struct {
	repo Repository
}

// NewService creates a new category service instance.
func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateCategory(ctx context.Context, input CreateCategoryInput) (*Category, error) {
	category := &Category{
		Name:        input.Name,
		Slug:        input.Slug,
		Description: input.Description,
		ParentID:    input.ParentID,
	}

	if err := s.repo.Create(ctx, category); err != nil {
		return nil, err
	}

	return category, nil
}

func (s *service) GetCategoryByID(ctx context.Context, id uint) (*Category, error) {
	category, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, ErrCategoryNotFound
	}
	return category, nil
}

func (s *service) ListCategories(ctx context.Context) ([]Category, error) {
	return s.repo.List(ctx)
}

func (s *service) UpdateCategory(ctx context.Context, id uint, input UpdateCategoryInput) (*Category, error) {
	category, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, ErrCategoryNotFound
	}

	if input.Name != "" {
		category.Name = input.Name
	}
	if input.Slug != "" {
		category.Slug = input.Slug
	}
	if input.Description != "" {
		category.Description = input.Description
	}
	if input.ParentID != nil {
		category.ParentID = input.ParentID
	}

	if err := s.repo.Update(ctx, category); err != nil {
		return nil, err
	}

	return category, nil
}

func (s *service) DeleteCategory(ctx context.Context, id uint) error {
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return ErrCategoryNotFound
	}
	return s.repo.Delete(ctx, id)
}
