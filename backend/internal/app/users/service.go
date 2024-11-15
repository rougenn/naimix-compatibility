package users

import (
	"database/sql"
	"errors"
	"naimix/internal/app/models"
)

var (
	ErrIncorrectData = errors.New("password and/or username are incorrect")
	ErrAlreadyExists = errors.New("user with this email or phone already exists")
	ErrNotFound      = errors.New("user not found")
)

func SignIn(DB *sql.DB, email, password string) (models.User, error) {
	user, err := GetUserByEmail(DB, email)
	if err != nil {
		return models.User{}, ErrIncorrectData
	}

	if user.PasswordHash != password { // Здесь должен быть хэш и проверка
		return models.User{}, ErrIncorrectData
	}

	return user, nil
}

func Register(DB *sql.DB, user models.User) error {
	if _, err := GetUserByPhone(DB, user.PhoneNumber); err == nil {
		return ErrAlreadyExists
	}

	if _, err := GetUserByEmail(DB, user.Email); err == nil {
		return ErrAlreadyExists
	}

	return AddToDB(DB, user)
}
