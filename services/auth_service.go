package services

import (
	"errors"

	"go-e_commerce/models"
	"go-e_commerce/repositories"
	"go-e_commerce/utils"

	"gorm.io/gorm"
)

func Register(name, email, password string) error {

	_, err := repositories.GetUserByEmail(email)

	if err == nil {
		return errors.New("email already exists")
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	hashedPassword, err := utils.HashPassword(password)

	if err != nil {
		return err
	}

	user := models.User{
		Name:     name,
		Email:    email,
		Password: hashedPassword,
	}

	return repositories.CreateUser(&user)
}