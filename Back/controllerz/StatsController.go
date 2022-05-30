package controllerz

import (
	"ToDoApp/entitiez"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

// keeps track of user's ststistics such as count of completed tasks and user score

func UpdateStats(ctx *gin.Context) {

	db, err := sql.Open("mysql", "root:Vitalizer228@tcp(127.0.0.1:3306)/test")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	var stats entitiez.UpdUserStats
	if err := ctx.BindJSON(&stats); err != nil {
		return
	}

	patch, err := db.Query(fmt.Sprintf("UPDATE todo_users SET user_completed = %d, user_score = %d WHERE user_id = %d", stats.Completed, stats.Score, stats.Id))

	if err != nil {
		panic(err.Error())
	}

	defer patch.Close()

	ctx.IndentedJSON(http.StatusAccepted, nil)
}
