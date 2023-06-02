include .env
export

.PHONY: gencert
gencert:
	./backend/cert/certgen.sh

.PHONY: run
run:
	./api

.PHONY: backend
backend:
	cd backend && go build -o api . && ./api

.PHONY: frontend
frontend:
	npm run dev --prefix frontend/ 

.PHONY: proto
proto:
	protoc proto/*.proto \
		--js_out=import_style=commonjs,binary:./frontend\
		--grpc-web_out=import_style=commonjs,mode=grpcwebtext:./frontend \
		--go-grpc_out=./backend/proto \
		--go_out=./backend/proto
	python -m grpc_tools.protoc -I./debrief_proto --python_out=./ai/debrief_proto --pyi_out=./ai/debrief_proto --grpc_python_out=./ai/debrief_proto ./proto/*.proto


.PHONY: start-db
start-db:
	brew services start mongodb-community@5.0

.PHONY: stop-db
stop-db:
	brew services stop mongodb-community@5.0
