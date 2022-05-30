package entitiez

type ToDo struct {
	Id     int    `json:"todo_id"`
	Name   string `json:"todo_name"`
	Comp   int    `json:"todo_complexity"`
	Status bool   `json:"todo_status"`
	UserId int    `json:"user_id"`
}

type ToDoes struct {
	ToDoes []ToDo `json:"todoes"`
}
