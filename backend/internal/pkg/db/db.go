package db

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

func NewDB() *sql.DB {
	db, err := sql.Open("postgres", "postgres://username:password@postgres:5432/storagedb?sslmode=disable")

	if err != nil {
		log.Fatal("connection: ", err)
		return nil
	}

	if err := db.Ping(); err != nil {
		log.Fatal("ping: ", err)
		return nil
	}

	return db
}
