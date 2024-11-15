package server

import (
	"database/sql"
	"errors"
	"log"
	"naimix/internal/app/members"
	"naimix/internal/app/models"
	"naimix/internal/app/teams"
	"naimix/internal/app/users"
	"naimix/internal/pkg/db"
	"net/http"

	"github.com/gin-gonic/gin"
)

var (
	ErrIncorrectData = errors.New("password and/or username are incorrect")
	ErrAlreadyExists = errors.New("user with this email or phone already exists")
	ErrNotFound      = errors.New("user not found")
)

type Server struct {
	host string
	DB   *sql.DB
}

func New(host string) *Server {
	database := db.NewDB()

	s := Server{
		host: host,
		DB:   database,
	}
	return &s
}

func (r *Server) Stop() {
	r.DB.Close()
}

func (r *Server) newAPI() *gin.Engine {
	engine := gin.New()

	engine.GET("/health", func(ctx *gin.Context) {
		ctx.Status(http.StatusOK)
	})

	engine.POST("/user/login", r.LogIn)
	engine.POST("/user/signup", r.Register)

	engine.POST("/team/create", r.CreateTeam)
	engine.POST("/team/delete", r.DeleteTeam)
	engine.POST("/team/add-member", r.AddMember)
	engine.POST("/team/delete-member", r.DeleteMember)

	engine.POST("/member/create", r.CreateMember)
	engine.POST("/member/delete", r.DeleteMember)

	return engine
}

func (r *Server) Start() {
	err := r.newAPI().Run(r.host)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func (r *Server) LogIn(ctx *gin.Context) {
	var req models.LoginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := users.SignIn(r.DB, req.Email, req.Password)
	if err != nil {
		if errors.Is(err, users.ErrIncorrectData) {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"user": user})
}

func (r *Server) Register(ctx *gin.Context) {
	var req models.RegisterRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := users.Register(r.DB, req)
	if err != nil {
		if errors.Is(err, users.ErrAlreadyExists) {
			ctx.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"user": user})
}

func (r *Server) CreateTeam(ctx *gin.Context) {
	var req struct {
		Name string `json:"name" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	team := models.Team{
		Name: req.Name,
	}

	teamID, err := teams.AddToDB(r.DB, team)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "Team created successfully", "team_id": teamID})
}

func (r *Server) DeleteTeam(ctx *gin.Context) {
	var req struct {
		TeamID int `json:"team_id" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := teams.DeleteFromDB(r.DB, req.TeamID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Team not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Team deleted successfully"})
}

func (r *Server) AddMember(ctx *gin.Context) {
	var req struct {
		TeamID   int `json:"team_id" binding:"required"`
		MemberID int `json:"member_id" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := teams.AddMemberToTeam(r.DB, req.TeamID, req.MemberID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Member added to team successfully"})
}

func (r *Server) RemoveMember(ctx *gin.Context) {
	var req struct {
		TeamID   int `json:"team_id" binding:"required"`
		MemberID int `json:"member_id" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := teams.RemoveMemberFromTeam(r.DB, req.TeamID, req.MemberID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Member not found in the team"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Member removed from team successfully"})
}

func (r *Server) CreateMember(ctx *gin.Context) {
	var req struct {
		Role      string                 `json:"role" binding:"required"`
		BirthInfo models.MemberBirthInfo `json:"birthday_info" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	member := models.Member{
		Role:      req.Role,
		BirthInfo: req.BirthInfo,
	}

	memberID, err := members.AddToDB(r.DB, member)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "Member created successfully", "member_id": memberID})
}

func (r *Server) DeleteMember(ctx *gin.Context) {
	var request struct {
		MemberID int `json:"member_id" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := members.DeleteFromDB(r.DB, request.MemberID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Member not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Member deleted successfully"})
}
