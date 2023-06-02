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
)

type Website struct {
	Id primitive.ObjectID `bson:"_id,omitempty"`

	UserId primitive.ObjectID `bson:"user_id"`

	RawLink string `bson:"raw_link"`

	CreationTime time.Time `bson:"creation_time,omitempty"`
}

func (website *Website) Proto() *proto.WebsiteEntity {
	if website.Id.IsZero() || website.UserId.IsZero() {
		return &proto.WebsiteEntity{}
	}
	resp := &proto.WebsiteEntity{
		Id:      website.Id.Hex(),
		UserId:  website.UserId.Hex(),
		RawLink: website.RawLink,
	}
	return resp
}

func (website *Website) String() string {
	if website == nil {
		fmt.Sprintf("<no site>")
	}
	return fmt.Sprintf("<Website id: %s link: %s>", website.Id.Hex(), website.RawLink)
}

func WebsiteQueryId(id primitive.ObjectID, database *mongo.Database) (*Website, error) {
	var website *Website
	filter := bson.D{{"_id", id}}
	if err := database.Collection(WEBSITES_COL).FindOne(context.TODO(), filter).Decode(&website); err != nil {
		log.Println(color.Ize(color.Red, err.Error()))
		return nil, &ErrorUserNotFound{Id: id}
	}

	return website, nil
}

func WebsiteInsert(link string, user_id primitive.ObjectID, database *mongo.Database) (*Website, error) {
	websiteD := &Website{
		UserId:  user_id,
		RawLink: link,
	}

	res, err := database.Collection(WEBSITES_COL).InsertOne(context.TODO(), websiteD)
	if err != nil {
		log.Println(color.Ize(color.Red, fmt.Sprintf("Failed to Insert Website: \nlink: %s", link)))
		return nil, err
	} else {
		id := res.InsertedID
		switch val := id.(type) {
		case primitive.ObjectID:
			websiteD.Id = val
		default:
			log.Println(color.Ize(color.Red, fmt.Sprintf("Generated User %s did not have a valid generated id", websiteD.Id.Hex())))
		}
		return websiteD, nil
	}
}
