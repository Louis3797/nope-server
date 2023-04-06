<div align="center">

  <h1>Nope Multiplayer Server</h1>
  
<!-- Badges -->
<p>
  <a href="https://github.com/Louis3797/express-ts-auth-service/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/Louis3797/express-ts-auth-service" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/Louis3797/express-ts-auth-service" alt="last update" />
  </a>
  <a href="https://github.com/Louis3797/express-ts-auth-service/issues/">
    <img src="https://img.shields.io/github/issues/Louis3797/express-ts-auth-service" alt="open issues" />
  </a>
  <a href="https://github.com/Louis3797/express-ts-auth-service/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Louis3797/express-ts-auth-service.svg" alt="license" />
  </a>
</p>

<h5>
    <a href="https://github.com/Louis3797/express-ts-auth-service#readme">Documentation</a>
  <span> · </span>
    <a href="https://github.com/Louis3797/express-ts-auth-service/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/Louis3797/express-ts-auth-service/issues/">Request Feature</a>
  </h5>
</div>

<!-- Table of Contents -->

# Table of Contents

- [Table of Contents](#table-of-contents)
  - [About the Project](#about-the-project)
    - [Tech Stack](#tech-stack)
    - [Endpoints](#endpoints)
      - [Rest API](#rest-api)
      - [Socket.io](#socketio)
    - [Integrate server into client](#integrate-server-into-client)
    - [Project Structure](#project-structure)
    - [Database](#database)
    - [Environment Variables](#environment-variables)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Linting](#linting)
    - [Running Tests](#running-tests)
    - [Run Locally](#run-locally)
    - [Run with Docker](#run-with-docker)

<!-- About the Project -->

## About the Project

The Nope multiplayer game server is designed to facilitate online gameplay for the card game Nope. It provides both a REST API and a WebSocket connection, enabling players to compete against each other in real-time. Built using Express.js, Socket.io, and TypeScript, the server supports two different game modes: standard 2-6 player gameplay and tournament mode.

<!-- TechStack -->

### Tech Stack

[![Technologies](https://skillicons.dev/icons?i=ts,nodejs,express,mysql,docker,prisma&perline=13)](https://skillicons.dev)


<!-- Endpoints -->

### Endpoints

#### Rest API

<!-- ```
POST /v1/auth/signup - Signup
POST /v1/auth/login - Login
POST /v1/auth/refresh - Refresh access token
POST /v1/forgot-password - Send reset password email
POST /v1/reset-password/:token - Reset password
POST /v1/send-verification-email - Send verification email
POST /v1/verify-email/:token - Verify email
``` -->

#### Socket.io

<!-- Integrate server into client -->

### Integrate server into client

<!-- Project Structure -->

### Project Structure

```txt
.
├── assets          # Assets for the Documentation
├── prisma
│   └── migrations  # Prisma Migrations
├── src
│   ├── config      # Config Files
│   ├── controller  # Controllers
│   ├── interfaces  # Typescript Interfaces
│   ├── middleware  # Custom Middleware
│   ├── routes      # Routes
│   ├── service     # Services
│   ├── socket      # Websocket specific Code
│   ├── types       # Typescript Types
│   ├── utils       # Utility Classes and Functions 
│   └── validations # Validation Schemas
│   └── app.ts      # Express App
│   └── index.ts    # Server Entrypoint
└── test
    ├── integration # Integration Tests
    └── unit        # Unit Tests
```

<!-- Database -->


### Database

Our server relies on MySQL as its primary database management system to store and manage all relevant data. MySQL is a popular and widely used open-source relational database system that provides efficient, secure, and scalable storage and retrieval of data.

To simplify and streamline the process of managing the data stored in the MySQL database, we utilize Prisma, which is a modern, type-safe ORM that supports various databases, including MySQL.

Prisma helps us to write database queries in a more readable and intuitive way, making it easier to manage the data stored in our MySQL database. By using Prisma as our ORM of choice, we can also ensure that our application remains scalable, efficient, and maintainable.

If you're interested in the structure of our database, you can take a look at the data model presented below, which provides an overview of the tables, columns, and relationships within the database.

![ERD](http://via.placeholder.com/640x360)

<!-- Env Variables -->

### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```yml
# App's running port
PORT=

# Cors origin url
# Example: https://example.com or for multiple origins 
# https://example.com|https://example2.com|https://example3.com or simple * to allow all origins
CORS_ORIGIN=

# database name
MYSQL_DATABASE=
# database root password
MYSQL_ROOT_PASSWORD=
# database user
MYSQL_USER=
# database user password
MYSQL_PASSWORD=
# database port
MYSQL_PORT=

# Example: mysql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=
```

See .env.example for further details

<!-- Getting Started -->

## Getting Started

<!-- Prerequisites -->

### Prerequisites

This project uses Yarn as package manager

```bash
 npm install --global yarn
```

<!-- Installation -->

### Installation

```bash
  git clone <github-repo>

  cd <name>

  yarn install # install dependencies
```

### Linting

```bash
  # run ESLint
  yarn lint

  # fix ESLint errors
  yarn lint:fix

  # run prettier
  yarn prettier:check

  # fix prettier errors
  yarn prettier:format

  # fix prettier errors in specific file
  yarn prettier:format:file <file-name>
```

<!-- Running Tests -->

### Running Tests

To run tests, run the following command

```bash
  yarn test
```

Run tests with watch flag

```bash
  yarn test:watch
```

See test coverage

```bash
  yarn coverage
```

<!-- Run Locally -->

### Run Locally

Start the server in development mode

> Note: Don't forget to define the .env variables

> In case MySQL is not installed on your computer, you can set up a running environment locally by running the server using [Docker Compose](#run-with-docker).

```bash
  yarn dev
```

Start the server in production mode

```bash
  yarn start
```

<!-- Run with Docker -->

### Run with Docker

Build Image out of Dockerfile
```bash
  docker build -t <image-name> .
```

> Use the --target flag to only build to a specific stage in the Dockerfile

Run Docker Image as Container 
```bash
  docker run --name <container-name> -p <exposed-port>:<port> <image-name>
```

Start Server and MySQL environment with docker compose

```bash
  docker-compose up
```