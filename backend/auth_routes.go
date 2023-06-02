package main

import (
	"context"
	"errors"
	"fmt"
	"log"

	"github.com/TwiN/go-color"
	db "github.com/alxrod/boiler/db"
	proto "github.com/alxrod/boiler/proto"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (s *BackServer) Register(ctx context.Context, req *proto.UserRegisterRequest) (*proto.UserSigninResponse, error) {
	database := s.dbClient.Database(s.dbName)
	if db.UserWEmailExists(req.Email, database) {
		return nil, &db.ErrorUserAlreadyExists{Email: req.Email}
	}

	user, err := db.UserInsert(req, database)

	if err != nil {
		return nil, err
	}
	tkn, tkn_timeout, err := s.JwtManager.Generate(user)
	if err != nil {
		return nil, err
	}

	s.EmailAgent.SendNotificationEmail(
		"user registered",
		fmt.Sprintf("A new user with the email %s has been registered",
			user.Email),
	)

	return &proto.UserSigninResponse{
		Token:        tkn,
		TokenTimeout: timestamppb.New(tkn_timeout),
		User:         user.Proto(),
	}, nil
}

func (s *BackServer) Login(ctx context.Context, req *proto.UserLoginRequest) (*proto.UserSigninResponse, error) {
	database := s.dbClient.Database(s.dbName)
	user, err := db.UserQueryEmail(req.Email, req.Password, database)
	if err != nil {
		return nil, err
	}

	tkn, tkn_timeout, err := s.JwtManager.Generate(user)
	if err != nil {
		return nil, err
	}

	return &proto.UserSigninResponse{
		Token:        tkn,
		TokenTimeout: timestamppb.New(tkn_timeout),
		User:         user.Proto(),
	}, nil

}
func (s *BackServer) Logout(ctx context.Context, req *proto.UserLogoutRequest) (*proto.NullResponse, error) {
	return &proto.NullResponse{}, nil
}

func (s *BackServer) Pull(ctx context.Context, req *proto.UserPullRequest) (*proto.UserEntity, error) {
	database := s.dbClient.Database(s.dbName)
	id, err := primitive.ObjectIDFromHex(req.UserId)
	if err != nil {
		log.Println(color.Ize(color.Red, err.Error()))
		return nil, err
	}
	user, err := db.UserQueryId(id, database)
	if err != nil {
		log.Println(color.Ize(color.Red, err.Error()))
		return nil, err
	}
	proto := user.Proto()
	if err != nil {
		return nil, err
	}
	return proto, nil
}

func (s *BackServer) ForgotPassword(ctx context.Context, req *proto.ForgotRequest) (*proto.NullResponse, error) {
	database := s.dbClient.Database(s.dbName)
	filter := bson.D{{"email", req.Email}}

	var err error
	var user *db.User

	if err = database.Collection(db.USERS_COL).FindOne(context.TODO(), filter).Decode(&user); err != nil {
		log.Println(color.Ize(color.Red, err.Error()))
		return nil, errors.New("we do not have that email in our system")
	}

	_, err = s.EmailAgent.CreateResetLink(user)
	if err != nil {
		return nil, err
	}

	return &proto.NullResponse{}, nil

}

func (s *BackServer) ConfirmResetId(ctx context.Context, req *proto.ResetConfirmRequest) (*proto.ResetConfirmResponse, error) {
	id, err := uuid.Parse(req.ResetId)
	if err != nil {
		return &proto.ResetConfirmResponse{
			ValidId: false,
		}, nil
	}
	exists := s.EmailAgent.CheckResetId(id)
	return &proto.ResetConfirmResponse{
		ValidId: exists,
	}, nil
}

func (s *BackServer) ChangePassword(ctx context.Context, req *proto.ChangePasswordRequest) (*proto.UserSigninResponse, error) {
	id, err := uuid.Parse(req.ResetId)
	if err != nil {
		return nil, errors.New("invalid reset id")
	}
	user_id, err := s.EmailAgent.GetUserId(id)
	if err != nil {
		return nil, err
	}

	database := s.dbClient.Database(s.dbName)
	user, err := db.UserChangePassword(user_id, req.NewPassword, database)

	tkn, tkn_timeout, err := s.JwtManager.Generate(user)
	if err != nil {
		return nil, err
	}

	return &proto.UserSigninResponse{
		Token:        tkn,
		TokenTimeout: timestamppb.New(tkn_timeout),
		User:         user.Proto(),
	}, nil

}
