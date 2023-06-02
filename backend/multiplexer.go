package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/TwiN/go-color"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
)

// These need to be updated by final secur verison

type MPServer struct {
	router *http.ServeMux
}

func NewMPServer() (*MPServer, error) {

	srv := &MPServer{
		router: http.NewServeMux(),
	}

	return srv, nil
}

func (srv *MPServer) SetUpHandler(multiplex *grpcMultiplexer) error {
	srv.router.Handle("/", multiplex.Handler())
	return nil
}

func (srv *MPServer) Serve(addr string) {
	s := &http.Server{
		Handler:     srv.router,
		Addr:        addr,
		ReadTimeout: 15 * time.Second,
	}
	log.Fatal(s.ListenAndServeTLS("cert/server.crt", "cert/server.key"))
}

type grpcMultiplexer struct {
	*grpcweb.WrappedGrpcServer
}

func errorHandler(w http.ResponseWriter, r *http.Request, status int) {
	w.WriteHeader(status)
	if status == http.StatusNotFound {
		fmt.Fprint(w, "404 - Not Found")
	}
}

func (m *grpcMultiplexer) Handler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		if m.IsGrpcWebRequest(r) || m.IsAcceptableGrpcCorsRequest(r) || r.Header.Get("Content-Type") == "application/grpc" || r.Header.Get("content-type") == "application/protobuf" {

			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
			w.Header().Set("Access-Control-Allow-Headers", "grpc-timeout, Accept, Content-Type, content-type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-User-Agent, X-Grpc-Web")

			if m.IsGrpcWebRequest(r) || r.Header.Get("Content-Type") == "application/grpc" {
				fmt.Printf(color.Ize(color.Cyan, fmt.Sprintf("Backend Request for : %s\n", r.URL)))
			}
			m.ServeHTTP(w, r)
			return

		}
		fmt.Printf(color.Ize(color.Purple, fmt.Sprintf("Bad Request for : %s\n", r.URL)))
		errorHandler(w, r, 404)
	})
}
