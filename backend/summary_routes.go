package main

import (
	"context"
	"errors"
	"log"

	"github.com/TwiN/go-color"
	db "github.com/alxrod/boiler/db"
	proto "github.com/alxrod/boiler/proto"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (s *BackServer) Get(ctx context.Context, req *proto.WebsiteByUserQuery) (*proto.WebsiteSet, error) {
	database := s.dbClient.Database(s.dbName)

	id, err := primitive.ObjectIDFromHex(req.UserId)
	if err != nil {
		log.Println(color.Ize(color.Red, err.Error()))
		return nil, err
	}
	websites, err := db.WebsiteSetQueryBy(bson.D{
		{"user_ids", id},
	}, database)
	if err != nil {
		return nil, err
	}
	websiteProtos := make([]*proto.WebsiteEntity, len(websites))
	for i := range websites {
		websiteProtos[i] = websites[i].Proto()
	}
	return &proto.WebsiteSet{
		Websites: websiteProtos,
	}, nil
}

func (s *BackServer) ToggleFlag(ctx context.Context, req *proto.FlagRequest) (*proto.NullResponse, error) {
	database := s.dbClient.Database(s.dbName)

	site_id, err := primitive.ObjectIDFromHex(req.WebsiteId)
	if err != nil {
		return nil, err
	}

	user_id, err := primitive.ObjectIDFromHex(req.UserId)
	if err != nil {
		log.Println(color.Ize(color.Red, err.Error()))
		return nil, err
	}

	website, err := db.WebsiteQueryBy(bson.D{
		{"_id", site_id},
	}, database)
	if err != nil {
		return nil, err
	}

	if info, ok := website.UserInfos[user_id]; ok {
		switch req.FlagName {
		case "read":
			info.Read = req.FlagStatus
		case "saved":
			info.Saved = req.FlagStatus
		case "archived":
			info.Archived = req.FlagStatus
		}
		website.Update(bson.D{
			{"$set", bson.D{
				{"user_infos." + user_id.Hex(), info},
			}},
		}, database)
	} else {
		return nil, errors.New("User not found for this site")
	}
	return &proto.NullResponse{}, nil
}
