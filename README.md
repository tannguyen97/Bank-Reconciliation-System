# Bank Reconciliation System

This project provides API for client to call via HTTP(s) protocolto import the transactions.

## Project structure

Diagram Architecture
![Bank reconciliation system](https://github.com/tannguyen97/Bank-Reconciliation-System/assets/47649797/3cc138f5-087c-4c6a-9412-30f4f44ce33e)




* This project is a microservices architecture using NestJS Framwork. These microservices communicate each other through RabbitMQ.
* This project is a Monorepo with apps folder contain 3 services file-upload, import-transaction and auth. Libs folder contain rabbitmq library and auth library to be used within these services.

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
## Account test:
- Username: 'admin'
- Password: 'admin'
## API
This is list CURL to verify API:
* /login: login with user created to get authentication token.
* /upload: API upload file for import transaction, client can choose file cvs, xlsx.
* /status: Check import transaction status.
* Link to Import Collection into Postman: https://drive.google.com/file/d/1B2ieSbP-W6ZUKRgZrRGcHxiIjiClX5io/view?usp=sharing
