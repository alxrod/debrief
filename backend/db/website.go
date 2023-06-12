package database

import (
	"context"
	"errors"
	"fmt"
	"log"
	"sort"

	"time"

	"github.com/TwiN/go-color"
	proto "github.com/alxrod/boiler/proto"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type Website struct {
	Id primitive.ObjectID `bson:"_id,omitempty"`

	UserIds []primitive.ObjectID `bson:"user_ids"`

	RawLink string `bson:"raw_link"`

	Title           string `bson:"title"`
	Summary         string `bson:"summary"`
	SummaryUploaded bool   `bson:"summary_uploaded"`

	CreationTime time.Time `bson:"creation_time,omitempty"`

	UserInfos map[primitive.ObjectID]UserInfo `bson:"user_infos,omitempty"`
}

func (website *Website) Proto() *proto.WebsiteEntity {
	user_id_strs := make([]string, len(website.UserIds))
	for i, uid := range website.UserIds {
		user_id_strs[i] = uid.Hex()
	}
	if website.Id.IsZero() {
		return &proto.WebsiteEntity{}
	}
	resp := &proto.WebsiteEntity{
		Id:              website.Id.Hex(),
		UserIds:         user_id_strs,
		RawLink:         website.RawLink,
		Title:           website.Title,
		Summary:         website.Summary,
		SummaryUploaded: website.SummaryUploaded,
	}

	infos := make(map[string]*proto.UserInfoEntity, len(website.UserInfos))
	for i, info := range website.UserInfos {
		infos[i.Hex()] = info.Proto()
	}
	resp.UserInfos = infos

	return resp
}

func (website *Website) String() string {
	if website == nil {
		fmt.Sprintf("<no site>")
	}
	return fmt.Sprintf("<Website id: %s link: %s>", website.Id.Hex(), website.RawLink)
}

func (website *Website) Update(update bson.D, database *mongo.Database) error {
	filter := bson.D{{"_id", website.Id}}
	_, err := database.Collection(WEBSITES_COL).UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	} else {
		return nil
	}
}

func WebsiteQueryBy(filter bson.D, database *mongo.Database) (*Website, error) {
	var website *Website
	if err := database.Collection(WEBSITES_COL).FindOne(context.TODO(), filter).Decode(&website); err != nil {
		log.Println(color.Ize(color.Red, err.Error()))
		return nil, errors.New("Website not found")
	}

	return website, nil
}

func WebsiteSetQueryBy(filter bson.D, database *mongo.Database) ([]*Website, error) {
	websites := make([]*Website, 0)

	cur, err := database.Collection(WEBSITES_COL).Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}
	for cur.Next(context.Background()) {
		var site *Website
		err := cur.Decode(&site)
		if err != nil {
			return nil, err
		}

		websites = append(websites, site)
	}
	cur.Close(context.Background())
	sort.Slice(websites, func(i, j int) bool {
		return websites[i].CreationTime.Before(websites[j].CreationTime)
	})
	return websites, nil
}
func WebsiteInsert(link string, user_id primitive.ObjectID, database *mongo.Database) (*Website, error) {
	ids := []primitive.ObjectID{user_id}
	websiteD := &Website{
		UserIds:   ids,
		RawLink:   link,
		UserInfos: make(map[primitive.ObjectID]UserInfo),
	}
	websiteD.UserInfos[user_id] = UserInfo{
		SaveTime: time.Now(),
		Read:     false,
		Archived: false,
		Saved:    false,
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

// ====================================================================================================

type UserInfo struct {
	SaveTime time.Time `bson:"save_time"`
	Read     bool      `bson:"read"`
	Archived bool      `bson:"archived"`
	Saved    bool      `bson:"saved"`
}

func (info *UserInfo) Proto() *proto.UserInfoEntity {

	resp := &proto.UserInfoEntity{
		SaveTime: timestamppb.New(info.SaveTime),
		Read:     info.Read,
		Archived: info.Archived,
		Saved:    info.Saved,
	}
	return resp
}
