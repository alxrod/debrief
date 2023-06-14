include .env
export

.PHONY: gencert
gencert:
	./backend/cert/certgen.sh

.PHONY: run
run:
	./api

.PHONY: build-backend
build-backend:
	cd backend && go build -o api .

.PHONY: deploy-backend
deploy-backend:
	cd backend && ./api

.PHONY: backend
backend:
	cd backend && go build -o api . && ./api
	
.PHONY: frontend
frontend:
	npm run dev --prefix frontend/ 

.PHONY: proto
proto:
	protoc debrief_proto/*.proto \
		--js_out=import_style=commonjs,binary:./frontend\
		--grpc-web_out=import_style=commonjs,mode=grpcwebtext:./frontend \
		--go-grpc_out=./backend/proto \
		--go_out=./backend/proto
	python -m grpc_tools.protoc -I./ --python_out=./ai --pyi_out=./ai --grpc_python_out=./ai ./debrief_proto/*.proto


.PHONY: start-db
start-db:
	brew services start mongodb-community@5.0

.PHONY: stop-db
stop-db:
	brew services stop mongodb-community@5.0
