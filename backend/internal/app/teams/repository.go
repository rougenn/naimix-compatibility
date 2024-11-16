package teams

import (
	"database/sql"
	"log"
	"naimix/internal/app/models"

	"github.com/lib/pq"
)

func AddToDB(db *sql.DB, userID int, team models.Team) (int, error) {
	query := `
		INSERT INTO teams (user_id, name, created_at)
		VALUES ($1, $2, EXTRACT(EPOCH FROM now())::BIGINT)
		RETURNING id
	`
	var teamID int
	err := db.QueryRow(query, userID, team.Name).Scan(&teamID)
	return teamID, err
}

func DeleteFromDB(db *sql.DB, userID, teamID int) error {
	query := `DELETE FROM teams WHERE id = $1 AND user_id = $2`
	result, err := db.Exec(query, teamID, userID)
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

func AddMemberToTeam(db *sql.DB, userID, teamID, memberID int) error {
	query := `
		INSERT INTO team_members (team_id, member_id)
		SELECT $1, $2
		FROM teams WHERE id = $1 AND user_id = $3
	`
	_, err := db.Exec(query, teamID, memberID, userID)
	return err
}

func RemoveMemberFromTeam(db *sql.DB, userID, teamID, memberID int) error {
	query := `
		DELETE FROM team_members
		WHERE team_id = $1 AND member_id = $2
		AND EXISTS (SELECT 1 FROM teams WHERE id = $1 AND user_id = $3)
	`
	result, err := db.Exec(query, teamID, memberID, userID)
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

func GetTeamWithMembers(db *sql.DB, userID, teamID int) (models.Team, []models.Member, error) {
	var team models.Team
	query := `
		SELECT id, name, created_at
		FROM teams
		WHERE id = $1 AND user_id = $2
	`
	err := db.QueryRow(query, teamID, userID).Scan(&team.ID, &team.Name, &team.CreatedAt)
	if err != nil {
		return team, nil, err
	}

	memberQuery := `
		SELECT m.id, m.role, m.birthday_timestamp, m.birthday_location
		FROM members m
		JOIN team_members tm ON m.id = tm.member_id
		WHERE tm.team_id = $1
	`
	rows, err := db.Query(memberQuery, teamID)
	if err != nil {
		return team, nil, err
	}
	defer rows.Close()

	var members []models.Member
	for rows.Next() {
		var member models.Member
		err := rows.Scan(&member.ID, &member.Role, &member.BirthInfo.Timestamp, &member.BirthInfo.Location)
		if err != nil {
			return team, nil, err
		}
		members = append(members, member)
	}

	return team, members, nil
}

func GetAllTeams(db *sql.DB, userID int) ([]models.Team, error) {
	query := `
		SELECT t.id, t.name, t.created_at, 
		       COALESCE(array_remove(array_agg(tm.member_id), NULL), '{}') AS member_ids
		FROM teams t
		LEFT JOIN team_members tm ON t.id = tm.team_id
		WHERE t.user_id = $1
		GROUP BY t.id
	`
	rows, err := db.Query(query, userID)
	if err != nil {
		log.Printf("Error executing query in GetAllTeams: %v", err)
		return nil, err
	}
	defer rows.Close()

	var teams []models.Team
	for rows.Next() {
		var team models.Team
		var memberIDs pq.Int64Array

		err := rows.Scan(&team.ID, &team.Name, &team.CreatedAt, &memberIDs)
		if err != nil {
			log.Printf("Error scanning row in GetAllTeams: %v", err)
			return nil, err
		}

		team.Members = make([]int, len(memberIDs))
		for i, id := range memberIDs {
			team.Members[i] = int(id)
		}

		teams = append(teams, team)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error iterating rows in GetAllTeams: %v", err)
		return nil, err
	}

	return teams, nil
}
