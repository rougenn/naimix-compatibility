package members

import (
	"database/sql"
	"log"
	"naimix/internal/app/models"
)

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

func AddToDB(db *sql.DB, userID int, member models.Member) (int, error) {
	log.Printf("Inserting member with userID: %d, member: %+v", userID, member) // Логируем
	query := `
        INSERT INTO members (role, birthday_timestamp, birthday_location, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `
	var memberID int
	err := db.QueryRow(query, member.Role, member.BirthInfo.Timestamp, member.BirthInfo.Location, userID).Scan(&memberID)
	if err != nil {
		log.Printf("Error inserting member: %s", err.Error()) // Логируем ошибку
		return 0, err
	}
	return memberID, nil
}

func DeleteFromDB(db *sql.DB, userID, memberID int) error {
	query := `
		DELETE FROM members
		WHERE id = $1 AND user_id = $2
	`
	result, err := db.Exec(query, memberID, userID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}

func GetAllMembers(db *sql.DB, userID int) ([]models.Member, error) {
	query := `
		SELECT id, role, birthday_timestamp, birthday_location
		FROM members
		WHERE user_id = $1
	`
	rows, err := db.Query(query, userID)
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
