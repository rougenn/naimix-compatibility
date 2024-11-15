package models

type User struct {
	ID           int    `json:"id"`
	FirstName    string `json:"first_name"`
	SecondName   string `json:"second_name"`
	CompanyName  string `json:"company_name"`
	Email        string `json:"email"`
	PhoneNumber  string `json:"phone_number"` // в формате +7..
	PasswordHash string `json:"-"`            // хеш пароля. будем сравнивать именно хеш.
	CreatedAt    int64  `json:"created_at"`   // время создания юникс
}

type Team struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	CreatedAt int64  `json:"created_at"` // время создания юникс
	Members   []int  `json:"members"`    // список участников команды по айдишникам
}

type MemberBirthInfo struct {
	Timestamp int64  `json:"birthday_timestamp"` // время дня рождения юникс
	Location  string `json:"birthday_location"`
}

type Member struct {
	ID        int             `json:"id"`
	Role      string          `json:"role"`
	BirthInfo MemberBirthInfo `json:"birthday_info"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
	FirstName   string `json:"first_name" binding:"required"`
	SecondName  string `json:"second_name" binding:"required"`
	Email       string `json:"email" binding:"required,email"`
	PhoneNumber string `json:"phone_number" binding:"required"`   // в формате +7..
	Password    string `json:"password" binding:"required,min=8"` // !!! пароль минимум 8 символов
	CompanyName string `json:"company_name"`
}
