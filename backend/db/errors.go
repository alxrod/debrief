package database

import (
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ErrorUserWithEmailAlreadyExists struct {
	Email string
}

func (e *ErrorUserWithEmailAlreadyExists) Error() string {
	return fmt.Sprintf("There is already an account for the email %s", e.Email)
}

type ErrorUserNotFound struct {
	Email string
	Id    primitive.ObjectID
}

func (e *ErrorUserNotFound) Error() string {
	if e.Email != "" {
		return fmt.Sprintf("There is no registered user with the email '%s'", e.Email)
	} else {
		return fmt.Sprintf("User not found with id %s in DB", e.Id.Hex())
	}

}

type ErrorUserAlreadyExists struct {
	Email string
}

func (e *ErrorUserAlreadyExists) Error() string {
	return fmt.Sprintf("User with username %s already exists in DB", e.Email)
}

type ErrorPasswordIncorrect struct {
	Email    string
	Password string
}

func (e *ErrorPasswordIncorrect) Error() string {
	return "That's the wrong password!"
}
