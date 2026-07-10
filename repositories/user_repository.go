package repositories

import (
	"go-e_commerce/config"
	"go-e_commerce/models"
)

func GetUserByEmail(email string) (*models.User, error) {

	var user models.User

	err := config.DB.
		Where("email = ?", email).
		First(&user).Error

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func CreateUser(user *models.User) error {

	return config.DB.Create(user).Error
}