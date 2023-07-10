# Bank Reconciliation System

This project provides API for client to call via HTTP(s) protocolto import the transactions.

## Project structure

Diagram Architecture
![Bank reconciliation system drawio](https://github.com/tannguyen97/Bank-Reconciliation-System/assets/47649797/ca46ab16-a61a-4e38-a8ae-6e3c9eb3bdb8)



* This project is a microservices architecture using NestJS Framwork. These microservices communicate each other through RabbitMQ.
* Due to project can have handle file up to 1 millition of records, so this project will stream file to handle import record into database. Purpose project using RabbitMQ to handle sequential large file and avoid timeout client side when call API import file.
* Before client import transactions project also require client must be authorized this is to avoid large number of requests anonymous into service. 

There are packages used for read stream file from cloud storage and parse to import records:

* [`csv-parse`]
  ([GitHub](https://github.com/adaltas/node-csv/tree/master/packages/csv-parse)),
  a parser converting CSV text into arrays or objects.
* [`xlsx-parse-stream`]
  ([GitHub](https://github.com/staeco/xlsx-parse-stream)),
  a parser converting XLSX nto arrays or objects.
## Installation Instructions

* First build the image and run container components, make sure docker enviroment setuped on local machine

How to start:
In root folder:
* Open new terminal to setting up containers:
```bash
docker-compose up -d
```
* ImportDB (Postgres) run by default on port `5433`
* RabbitMQ run by default on port `5672` and `15672`

* Open new terminal 1 to start file-upload service on the command line:
```bash
npm install --legacy-peer-deps
```
```bash
nest start 
```
Application will run by default on port `3000`

* Open new terminal 2 to start import-transaction service on the command line:
```bash
nest start import-transaction
```

* Open new terminal 3 in start authenication service on the command line:
```bash
nest start auth
```
Application will run by default on port `3001`

## API
This is list CURL to verify API:
* /login: login with user created to get authentication token.
* /upload: API upload file for import transaction, client can choose file cvs, xlsx.
* Link to Import Collection into Postman:
