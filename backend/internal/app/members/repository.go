package members

import (
	"database/sql"
	"naimix/internal/app/models"
)

func AddToDB(db *sql.DB, member models.Member) (int, error) {
	query := `
		INSERT INTO members (role, birthday_timestamp, birthday_location)
		VALUES ($1, $2, $3)
		RETURNING id
	`
	var memberID int
	err := db.QueryRow(query, member.Role, member.BirthInfo.Timestamp, member.BirthInfo.Location).Scan(&memberID)
	return memberID, err
}

func DeleteFromDB(db *sql.DB, memberID int) error {
	query := `DELETE FROM members WHERE id = $1`
	result, err := db.Exec(query, memberID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows // Возвращаем стандартную ошибку для случаев, когда запись не найдена
	}

	return nil
}

func GetMemberByID(db *sql.DB, memberID int) (models.Member, error) {
	var member models.Member
	query := `
		SELECT id, role, birthday_timestamp, birthday_location
		FROM members
		WHERE id = $1
	`
	row := db.QueryRow(query, memberID)
	err := row.Scan(&member.ID, &member.Role, &member.BirthInfo.Timestamp, &member.BirthInfo.Location)
	return member, err
}

func GetAllMembers(db *sql.DB) ([]models.Member, error) {
	query := `
		SELECT id, role, birthday_timestamp, birthday_location
		FROM members
	`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var members []models.Member
	for rows.Next() {
		var member models.Member
		err := rows.Scan(&member.ID, &member.Role, &member.BirthInfo.Timestamp, &member.BirthInfo.Location)
		if err != nil {
			return nil, err
		}
		members = append(members, member)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return members, nil
}
