package controllerz

import (
	"ToDoApp/entitiez"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

// creates a new to do, writes data into the mySQL db.

func CreateToDo(ctx *gin.Context) {
	db, err := sql.Open("mysql", "root:Vitalizer228@tcp(127.0.0.1:3306)/test")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	var todo entitiez.ToDo
	if err := ctx.BindJSON(&todo); err != nil {
		return
	}

	insert, err := db.Query(fmt.Sprintf("INSERT INTO todoes(todo_name, todo_complexity, user_id) VALUES('%s', '%d', '%d')", todo.Name, todo.Comp, todo.UserId))

	if err != nil {
		panic(err.Error())
	}

	defer insert.Close()

	ctx.IndentedJSON(http.StatusCreated, todo)
}

// gets all todoes from the db and sends it to the front

func GetToDoes(ctx *gin.Context) {

	var todos entitiez.ToDoes

	db, err := sql.Open("mysql", "root:Vitalizer228@tcp(127.0.0.1:3306)/test")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	type Usr struct {
		Id int `json:"id"`
	}

	var user Usr
	if err := ctx.BindJSON(&user); err != nil {
		return
	}

	results, err := db.Query(fmt.Sprintf("SELECT * FROM todoes WHERE user_id = %d", user.Id))
	if err != nil {
		panic(err.Error())
	}

	for results.Next() {

		var todo entitiez.ToDo

		err = results.Scan(&todo.Id, &todo.Name, &todo.Comp, &todo.Status, &todo.UserId)
		if err != nil {
			panic(err.Error())
		}

		todos.ToDoes = append(todos.ToDoes, todo)

	}

	ctx.IndentedJSON(200, todos.ToDoes)
}

// changing todo status from uncompleted to completed

func UpdateToDoStatus(ctx *gin.Context) {
	db, err := sql.Open("mysql", "root:Vitalizer228@tcp(127.0.0.1:3306)/test")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	var todo entitiez.ToDo
	if err := ctx.BindJSON(&todo); err != nil {
		return
	}

	patch, err := db.Query(fmt.Sprintf("UPDATE todoes SET todo_status = TRUE where todo_id = %d", todo.Id))

	if err != nil {
		panic(err.Error())
	}

	defer patch.Close()

	ctx.IndentedJSON(http.StatusNoContent, todo)
}
