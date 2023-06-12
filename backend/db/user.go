package database

import (
	"context"
	"fmt"
	"log"

	"time"

	"github.com/TwiN/go-color"
	proto "github.com/alxrod/boiler/proto"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id       primitive.ObjectID `bson:"_id,omitempty"`
	Email    string             `bson:"email"`
	Password string             `bson:"password"`

	Active_token string    `bson:"-"`
	CreationTime time.Time `bson:"creation_time,omitempty"`
}

func (user *User) Proto() *proto.UserEntity {
	if user.Id.IsZero() {
		return &proto.UserEntity{}
	}
	resp := &proto.UserEntity{
		Id:    user.Id.Hex(),
		Email: user.Email,
	}

	return resp
}

func (user *User) String() string {
	if user == nil {
		fmt.Sprintf("<no user>")
	}
	return fmt.Sprintf("<User id: %s name: %s>", user.Id.Hex(), user.Email)
}

// DB Functions, general style is operation params, collection -> error
func UserQueryEmail(email, password string, database *mongo.Database) (*User, error) {
	var user *User
	filter := bson.D{{"email", email}}
	var err error
	if err = database.Collection(USERS_COL).FindOne(context.TODO(), filter).Decode(&user); err != nil {
		log.Println(color.Ize(color.Red, err.Error()))
		return nil, &ErrorUserNotFound{Email: email}
	}

	if password != "" {
		if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
			return nil, &ErrorPasswordIncorrect{Email: user.Email, Password: password}
		}
	}

	return user, nil
}

func ServerUserQuery(email string, database *mongo.Database) (*User, error) {
	var user *User
	filter := bson.D{{"email", email}}
	var err error
	if err = database.Collection(USERS_COL).FindOne(context.TODO(), filter).Decode(&user); err != nil {
		log.Println(color.Ize(color.Red, err.Error()))
		return nil, &ErrorUserNotFound{Email: email}
	}

	return user, nil
}

func UserWEmailExists(email string, database *mongo.Database) bool {
	var user *User
	filter := bson.D{{"email", email}}
	var err error
	if err = database.Collection(USERS_COL).FindOne(context.TODO(), filter).Decode(&user); err != nil {
		return false
	}
	return true
}

func UserChangePassword(id primitive.ObjectID, password string, database *mongo.Database) (*User, error) {
	user, err := UserQueryId(id, database)
	if err != nil {
		return nil, err
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 8)
	if err != nil {
		return nil, err
	}
	user.Password = string(hashedPassword)

	filter := bson.D{{"_id", id}}
	update := bson.D{{"$set", bson.D{{"password", user.Password}}}}
	_, err = database.Collection(USERS_COL).UpdateOne(context.TODO(), filter, update)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func UserQueryId(id primitive.ObjectID, database *mongo.Database) (*User, error) {
	var user *User
	filter := bson.D{{"_id", id}}
	if err := database.Collection(USERS_COL).FindOne(context.TODO(), filter).Decode(&user); err != nil {
		log.Println(color.Ize(color.Red, err.Error()))
		return nil, &ErrorUserNotFound{Id: id}
	}

	return user, nil
}

func UserInsert(req *proto.UserRegisterRequest, database *mongo.Database) (*User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 8)
	if err != nil {
		return nil, err
	}

	userD := &User{
		Password:     string(hashedPassword),
		CreationTime: time.Now(),
		Email:        req.Email,
	}

	res, err := database.Collection(USERS_COL).InsertOne(context.TODO(), userD)
	if err != nil {
		log.Println(color.Ize(color.Red, fmt.Sprintf("Failed to Insert User: \nemail: %s", req.Email)))
		return nil, err
	} else {
		id := res.InsertedID
		switch val := id.(type) {
		case primitive.ObjectID:
			userD.Id = val
		default:
			log.Println(color.Ize(color.Red, fmt.Sprintf("Generated User %s did not have a valid generated id", userD.Email)))
		}
		return userD, nil
	}
}
