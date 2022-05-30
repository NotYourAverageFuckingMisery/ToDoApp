package controllerz

import (
	"ToDoApp/entitiez"
	"ToDoApp/security"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

// logic for the register page. hashes the pwd with bcrypt package with function from file HashPwd.

func RegisterUser(ctx *gin.Context) {
	db, err := sql.Open("mysql", "root:Vitalizer228@tcp(127.0.0.1:3306)/test")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	var user entitiez.User
	if err := ctx.BindJSON(&user); err != nil {
		return
	}

	hashedPwd, err := security.HashPassword(user.Pwd)
	if err != nil {
		panic(err.Error())
	}

	insert, err := db.Query(fmt.Sprintf("INSERT INTO todo_users(user_login, user_password, user_name) VALUES('%s', '%s', '%s')", user.Login, hashedPwd, user.Name))

	if err != nil {
		panic(err.Error())
	}

	defer insert.Close()

	ctx.IndentedJSON(http.StatusCreated, user)
}

// sends all user logins to check if the submited login is awalible. Made this validation this way for less requests to the back end

func GetUsersLogins(ctx *gin.Context) {

	var logins entitiez.AllLogins

	db, err := sql.Open("mysql", "root:Vitalizer228@tcp(127.0.0.1:3306)/test")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	results, err := db.Query("SELECT user_login FROM todo_users")
	if err != nil {
		panic(err.Error())
	}

	for results.Next() {
		var login string
		err = results.Scan(&login)
		if err != nil {
			panic(err.Error())
		}
		logins.Logins = append(logins.Logins, login)
	}

	fmt.Println(logins)

	ctx.IndentedJSON(http.StatusOK, logins)
}
