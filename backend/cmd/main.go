package main

import (
	"log"
	"naimix/internal/pkg/db"
	"naimix/internal/pkg/server"
)

func main() {
	// get port from environment
	s := server.New(":8090")

	err := db.Migrate(s.DB, "scripts/migration.sql")
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	s.Start()
}
