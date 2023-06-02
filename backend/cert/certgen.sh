#!/bin/bash

# generate ca.key 
openssl genrsa -out backend/cert/ca.key 4096
# generate certificate
openssl req -new -x509 -key backend/cert/ca.key -sha256 -subj "/C=SE/ST=HL/O=Example, INC." -days 365 -out backend/cert/server.crt
# generate the server key
openssl genrsa -out backend/cert/server.key 4096
# Generate the csr
openssl req -new -key backend/cert/server.key -out backend/cert/server.csr -config backend/cert/certificate.conf
# 
openssl x509 -req -in backend/cert/server.csr -CA backend/cert/server.crt -CAkey backend/cert/ca.key -CAcreateserial -out backend/cert/server.crt -days 365 -sha256 -extfile backend/cert/certificate.conf -extensions req_ext
