package main

import (
	"context"
	"crypto/tls"
	"fmt"
	"log"
	"net"
	"os"
	"time"

	"github.com/TwiN/go-color"
	"github.com/improbable-eng/grpc-web/go/grpcweb"

	interceptors "github.com/alxrod/boiler/interceptors"
	proto "github.com/alxrod/boiler/proto"
	services "github.com/alxrod/boiler/services"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const debug = false

// Update this to use .env value
const (
	secretKey     = "my_secret_key"
	tokenDuration = 15 * time.Minute
)

// All the public
func accessibleRoles() []string {

	return []string{
		"/communication.Auth/Register",
		"/communication.Auth/Login",
		"/communication.Auth/ForgotPassword",
		"/communication.Auth/ConfirmResetId",
		"/communication.Auth/ChangePassword",
		"/communication.Test/Ping",
	}
}

type BackServer struct {
	proto.UnimplementedAuthServer
	proto.UnimplementedSummaryServer
	proto.UnimplementedTestServer

	JwtManager *services.JWTManager
	EmailAgent *services.EmailAgent

	GrpcSrv  *grpc.Server
	lis      net.Listener
	dbClient *mongo.Client
	dbName   string
	dbCtx    context.Context
}

func (s *BackServer) Serve() {
	log.Fatal(s.GrpcSrv.Serve(s.lis))
}

func (s *BackServer) Shutdown() {
	s.dbClient.Disconnect(s.dbCtx)
}

func NewGrpcServer(pemPath, keyPath string, jwtManager *services.JWTManager) (*grpc.Server, error) {
	var cred credentials.TransportCredentials
	var err error

	if debug {
		log.Println(color.Ize(color.Yellow, "Running without TLS"))
		cred = credentials.NewTLS(&tls.Config{
			InsecureSkipVerify: true,
		})
	} else {
		cred, err = credentials.NewServerTLSFromFile(pemPath, keyPath)
		if err != nil {
			return nil, err
		}
	}

	authIntercept := interceptors.NewAuthInterceptor(jwtManager, accessibleRoles())

	s := grpc.NewServer(
		grpc.Creds(cred),
		grpc.UnaryInterceptor(authIntercept.Unary()),
		grpc.StreamInterceptor(authIntercept.Stream()),
	)

	return s, nil
}

func NewServer(server_cert, server_key, addr string) (*BackServer, error) {
	jwtManager := services.NewJWTManager(secretKey, tokenDuration)

	grpcServer, err := NewGrpcServer(server_cert, server_key, jwtManager)
	if err != nil {
		return nil, err
	}

	lis, err := net.Listen("tcp", addr)
	if err != nil {
		return nil, err
	}

	dbIP := os.Getenv("DB_IP")
	dbName := os.Getenv("DB_NAME")
	dbUsername := os.Getenv("DB_USERNAME")
	dbPassword := os.Getenv("DB_PASSWORD")

	credential := options.Credential{
		Username: dbUsername,
		Password: dbPassword,
	}

	opts := options.Client().ApplyURI(fmt.Sprintf("mongodb://%s:27017", dbIP))

	if os.Getenv("DB_DEBUG") == "false" {
		opts.SetAuth(credential)
	}
	client, err := mongo.NewClient(opts)

	if err != nil {
		return nil, err
	}

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		return nil, err
	}

	s := &BackServer{
		lis:        lis,
		GrpcSrv:    grpcServer,
		JwtManager: jwtManager,
		EmailAgent: &services.EmailAgent{},

		dbName:   dbName,
		dbClient: client,
		dbCtx:    ctx,
	}

	s.EmailAgent.Initialize(&tls.Config{
		InsecureSkipVerify: true,
	}, client.Database(dbName))

	// Have to add this for every service
	proto.RegisterAuthServer(grpcServer, s)
	proto.RegisterSummaryServer(grpcServer, s)
	proto.RegisterTestServer(grpcServer, s)

	return s, nil
}

func main() {
	// Create backend server
	grpc_addr := fmt.Sprintf("%s:%s", os.Getenv("GRPC_IP"), os.Getenv("GRPC_PORT"))
	api_addr := fmt.Sprintf("%s:%s", os.Getenv("API_IP"), os.Getenv("API_PORT"))
	backend_server, err := NewServer("cert/server.crt", "cert/server.key", grpc_addr)
	defer backend_server.Shutdown()
	if err != nil {
		log.Fatal(err)
	}
	// Serve it in a seperate thread
	go func() {
		log.Println(color.Ize(color.Cyan, fmt.Sprintf("Starting GRPC server on %s", grpc_addr)))
		backend_server.Serve()
	}()

	grpcWebServer := grpcweb.WrapServer(backend_server.GrpcSrv, grpcweb.WithAllowedRequestHeaders([]string{"*"}))
	multiplex := &grpcMultiplexer{
		grpcWebServer,
	}
	http_server, err := NewMPServer()
	if err != nil {
		log.Fatal(err)
	}

	// Set up the routes and serve it
	http_server.SetUpHandler(multiplex)
	log.Println(color.Ize(color.Green, fmt.Sprintf("Starting HTTP server on %s", api_addr)))
	http_server.Serve(api_addr)
}
