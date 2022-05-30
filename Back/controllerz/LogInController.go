package controllerz

import (
	"ToDoApp/entitiez"
	"ToDoApp/security"
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

const SecretKey = "SokfAjsjsjs92430"

// log in logic, creates a jwt token, sets the user cookie and tells it to the browser. using package jwt/v4

func LoginUser(ctx *gin.Context) {

	var request entitiez.User
	if err := ctx.BindJSON(&request); err != nil {
		return
	}

	db, err := sql.Open("mysql", "root:Vitalizer228@tcp(127.0.0.1:3306)/test")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	res, err := db.Query(fmt.Sprintf("SELECT user_password FROM todo_users WHERE user_login = '%s'", request.Login))
	if err != nil {
		panic(err.Error())
	}
	var hash string
	for res.Next() {
		err = res.Scan(&hash)
		if err != nil {
			panic(err.Error())
		}
	}

	if security.CheckPasswordHash(request.Pwd, hash) {

		result, err := db.Query(fmt.Sprintf("SELECT * FROM todo_users WHERE user_login = '%s' AND user_password = '%s'", request.Login, hash))
		if err != nil {
			panic(err.Error())
		}

		var user entitiez.User

		for result.Next() {
			err = result.Scan(&user.Id, &user.Login, &user.Pwd, &user.Name, &user.Completed, &user.Score)
			if err != nil {
				panic(err.Error())
			}
		}

		// jwt authorisation token
		expireTime := jwt.NewNumericDate(time.Now().Add(time.Hour * 24))
		issuedTime := jwt.NewNumericDate(time.Now())
		claims := jwt.NewWithClaims(jwt.SigningMethodHS256, &jwt.RegisteredClaims{
			ExpiresAt: expireTime,
			IssuedAt:  issuedTime,
			Issuer:    strconv.Itoa(user.Id),
		})

		token, err := claims.SignedString([]byte(SecretKey))
		if err != nil {
			ctx.IndentedJSON(http.StatusInternalServerError, "Could not log in!")
			return
		}

		if len(user.Login) < 1 {
			ctx.IndentedJSON(http.StatusForbidden, "Wrong login or password!")
			return
		}

		// idk how to set cookie with gin properly so i did this hope this will work !!! UPD this works just fine lol
		c := &http.Cookie{
			Name:     "jwtoken",
			Value:    token,
			Expires:  time.Now().Add(time.Hour * 24),
			HttpOnly: true,
		}
		http.SetCookie(ctx.Writer, c)

		ctx.IndentedJSON(http.StatusAccepted, "Sucsess")
	} else {
		ctx.IndentedJSON(http.StatusForbidden, "Wrong login or password!")
		return
	}

}

// sends the full user info to the front, based on the cookie that was set in the LoginUser function.

func AuthUser(ctx *gin.Context) {

	cookie, err := ctx.Cookie("jwtoken")
	if err != nil {
		fmt.Println(err.Error())
	}

	token, err := jwt.ParseWithClaims(cookie, &jwt.RegisteredClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})
	if err != nil {
		ctx.IndentedJSON(http.StatusUnauthorized, "Unautorised")
	} else {

		claims := token.Claims.(*jwt.RegisteredClaims)

		db, err := sql.Open("mysql", "root:Vitalizer228@tcp(127.0.0.1:3306)/test")
		if err != nil {
			panic(err.Error())
		}
		defer db.Close()

		result, err := db.Query(fmt.Sprintf("SELECT * FROM todo_users WHERE user_id = '%s'", claims.Issuer))
		if err != nil {
			panic(err.Error())
		}

		var user entitiez.User

		for result.Next() {
			err = result.Scan(&user.Id, &user.Login, &user.Pwd, &user.Name, &user.Completed, &user.Score)
			if err != nil {
				panic(err.Error())
			}
		}

		// a weird way to not send user password within a json. Somewhy changing tags and structs didn't worked so i did this lol
		user.Pwd = ":)"

		ctx.IndentedJSON(http.StatusOK, user)
	}
}

// simple logout logic, expires a cookie by setting expire time at 1 h ago

func LogoutUser(ctx *gin.Context) {
	c := &http.Cookie{
		Name:     "jwtoken",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HttpOnly: true,
	}
	http.SetCookie(ctx.Writer, c)

	ctx.IndentedJSON(http.StatusOK, "Sucsessful logout!")
}
