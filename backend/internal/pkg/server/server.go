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
	defer database.Close()

	s := Server{
		host: host,
		DB:   database,
	}
	return &s
}

func (r *Server) newAPI() *gin.Engine {
	engine := gin.New()

	engine.GET("/health", func(ctx *gin.Context) {
		ctx.Status(http.StatusOK)
	})

	engine.POST("/user/login")
	engine.POST("/user/signup")
	engine.POST("/team/create")
	engine.POST("/team/delete")
	engine.POST("/team/add-member")
	engine.POST("/team/delete-member")
	engine.POST("/member/create")
	engine.POST("/member/delete")

	return engine
}

func (r *Server) Start() {
	err := r.newAPI().Run(r.host)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func (r *Server) LogIn(ctx *gin.Context) {
	var req struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := users.SignIn(r.DB, req.Email, req.Password)
	if err != nil {
		if err == ErrIncorrectData {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"user": user})
}

func (r *Server) Register(ctx *gin.Context) {
	var req models.User
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := users.Register(r.DB, req)
	if err != nil {
		if err == ErrAlreadyExists {
			ctx.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

func (r *Server) CreateTeam(ctx *gin.Context) {
	var req models.Team
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	teamID, err := teams.AddToDB(r.DB, req)
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
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Member removed from team successfully"})
}

func (r *Server) CreateMember(ctx *gin.Context) {
	var member models.Member
	if err := ctx.ShouldBindJSON(&member); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
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

	if err := members.DeleteFromDB(r.DB, request.MemberID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Member deleted successfully"})
}
