package main

import (
	"ToDoApp/controllerz"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// this is a simple

func main() {
	server := gin.Default()

	server.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
		AllowHeaders:     []string{"Origin", "Accept", "X-Requested-With", "Content-Type"},
		AllowCredentials: true,
	}))

	server.POST("/todoes", controllerz.GetToDoes)
	server.PUT("/todoes", controllerz.CreateToDo)
	server.PATCH("/todoes", controllerz.UpdateToDoStatus)

	server.POST("/register", controllerz.RegisterUser)
	server.GET("/register", controllerz.GetUsersLogins)

	server.POST("/login", controllerz.LoginUser)

	server.GET("/user", controllerz.AuthUser)

	server.POST("/logout", controllerz.LogoutUser)

	server.PATCH("/userscore", controllerz.UpdateStats)

	server.Run(":8081")
}
