package teams

import (
	"database/sql"
	"naimix/internal/app/models"
)

func AddToDB(db *sql.DB, team models.Team) (int, error) {
	query := `
		INSERT INTO teams (name, created_at)
		VALUES ($1, $2)
		RETURNING id
	`
	var teamID int
	err := db.QueryRow(query, team.Name, team.CreatedAt).Scan(&teamID)
	return teamID, err
}

func DeleteFromDB(db *sql.DB, teamID int) error {
	query := `DELETE FROM teams WHERE id = $1`
	_, err := db.Exec(query, teamID)
	return err
}

func AddMemberToTeam(db *sql.DB, teamID, memberID int) error {
	query := `
		INSERT INTO team_members (team_id, member_id)
		VALUES ($1, $2)
	`
	_, err := db.Exec(query, teamID, memberID)
	return err
}

func RemoveMemberFromTeam(db *sql.DB, teamID, memberID int) error {
	query := `
		DELETE FROM team_members
		WHERE team_id = $1 AND member_id = $2
	`
	_, err := db.Exec(query, teamID, memberID)
	return err
}

func GetTeamWithMembers(db *sql.DB, teamID int) (models.Team, []models.Member, error) {
	var team models.Team
	query := `
		SELECT id, name, created_at
		FROM teams
		WHERE id = $1
	`
	err := db.QueryRow(query, teamID).Scan(&team.ID, &team.Name, &team.CreatedAt)
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
