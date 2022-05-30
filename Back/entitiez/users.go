package entitiez

type User struct {
	Id        int    `json:"user_id"`
	Login     string `json:"user_login"`
	Pwd       string `json:"user_password"`
	Name      string `json:"user_name"`
	Completed int    `json:"user_completed"`
	Score     int    `json:"user_score"`
}

type AllUsers struct {
	Users []User `json:"allUsers"`
}

type AllLogins struct {
	Logins []string `json:"all_logins"`
}

type UpdUserStats struct {
	Id        int `json:"id"`
	Score     int `json:"score"`
	Completed int `json:"completed"`
}
