package main

import (
	"context"

	proto "github.com/alxrod/boiler/proto"
)

func (s *BackServer) Ping(ctx context.Context, req *proto.PingRequest) (*proto.PingResponse, error) {
	// resp, err := s.AIClient.Ping(context.Background(), &proto.PingRequest{})
	// if err != nil {
	// 	return nil, err
	// }

	return &proto.PingResponse{
		Message: "Hello World",
	}, nil
}
