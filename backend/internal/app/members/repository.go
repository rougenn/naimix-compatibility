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
	_, err := db.Exec(query, memberID)
	return err
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
