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
    <a href="https://github.com/Louis3797/express-ts-auth-service#readme">Dokumentation</a>
  <span> · </span>
    <a href="https://github.com/Louis3797/express-ts-auth-service/issues/">Bug melden</a>
  <span> · </span>
    <a href="https://github.com/Louis3797/express-ts-auth-service/issues/">Feature anfordern</a>
  </h5>
</div>

<!-- Table of Contents -->

# Inhaltsübersicht

- [Inhaltsübersicht](#inhaltsübersicht)
  - [Über das Projekt](#über-das-projekt)
    - [Tech Stack](#tech-stack)
    - [Endpoints](#endpoints)
      - [Rest API](#rest-api)
      - [Socket.io](#socketio)
    - [Server in Client integrieren](#server-in-client-integrieren)
    - [Projektstruktur](#projektstruktur)
    - [Datenbank](#datenbank)
    - [Umgebungsvariablen](#umgebungsvariablen)
  - [Erste Schritte](#erste-schritte)
    - [Voraussetzungen](#voraussetzungen)
    - [Installation](#installation)
    - [Linting](#linting)
    - [Tests ausführen](#tests-ausführen)
    - [Local ausführen](#local-ausführen)
    - [Ausführen mit Docker](#ausführen-mit-docker)

<!-- About the Project -->

## Über das Projekt

Der Nope Multiplayer Game Server wird für die Abwicklung von Online-Spielen für das Nope-Kartenspiel verwendet. Er bietet sowohl eine REST-API als auch eine WebSocket-Verbindung und ermöglicht es Spielern, in Echtzeit gegeneinander anzutreten. Der Server wurde mit Express.js, Socket.io und TypeScript entwickelt und unterstützt zwei verschiedene Spielmodi: Standardspiel für 2-6 Spieler und Turniermodus.

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

### Server in Client integrieren

<!-- Project Structure -->

### Projektstruktur

```txt
.
├── assets          # Assets für die Dokumentation
├── prisma
│   └── migrations  # Prisma Migrations
├── src
│   ├── config      # Config Dateien
│   ├── controller  # Controllers
│   ├── interfaces  # Typescript Interfaces
│   ├── middleware  # Custom Middleware
│   ├── routes      # Routes
│   ├── service     # Services
│   ├── socket      # Websocket spezifischer Code
│   ├── types       # Typescript Types
│   ├── utils       # Utility Klassen und Funktionen
│   └── validations # Validation Schemas
│   └── app.ts      # Express App
│   └── index.ts    # Server Entrypoint
└── test
    ├── integration # Integration Tests
    └── unit        # Unit Tests
```

<!-- Database -->

### Datenbank

Unser Server nutzt MySQL als primäres Datenbankmanagementsystem zur Speicherung und Verwaltung aller relevanten Daten. MySQL ist ein beliebtes und weit verbreitetes relationales Open-Source-Datenbanksystem, das eine effiziente, sichere und skalierbare Speicherung und Abfrage von Daten ermöglicht.

Um die Verwaltung der in der MySQL-Datenbank gespeicherten Daten zu vereinfachen und zu rationalisieren, setzen wir Prisma ein, ein modernes, typsicheres ORM, das verschiedene Datenbanken, darunter auch MySQL, unterstützt.

Prisma hilft uns, Datenbankabfragen in einer besser lesbaren und intuitiven Weise zu schreiben, was die Verwaltung der in unserer MySQL-Datenbank gespeicherten Daten erleichtert. Durch den Einsatz von Prisma als ORM unserer Wahl können wir außerdem sicherstellen, dass unsere Anwendung skalierbar, effizient und wartungsfreundlich bleibt.

Wenn Sie sich für die Struktur unserer Datenbank interessieren, können Sie einen Blick auf das unten dargestellte Datenmodell werfen, das einen Überblick über die Tabellen, Spalten und Beziehungen innerhalb der Datenbank gibt.

![ERD](assets/mysql_erd.png)

<!-- Env Variables -->

### Umgebungsvariablen

Um dieses Projekt auszuführen, müssen Sie die folgenden Umgebungsvariablen zu Ihrer .env-Datei hinzufügen

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

Siehe .env.example für weitere Details

<!-- Getting Started -->

## Erste Schritte

<!-- Prerequisites -->

### Voraussetzungen

Dieses Projekt nutzt Yarn als Packetmanager

```bash
 npm install --global yarn
```

<!-- Installation -->

### Installation

```bash
  git clone <github-repo>

  cd <name>

  yarn install # install dependencies

  yarn husky install

  yarn prisma:gen
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
```

<!-- Running Tests -->

### Tests ausführen

Die Tests lassen sich mit folgenden Befehl ausführen

```bash
  yarn test
```

Um die Tests mit der --watch flag laufen zu lassen kann man dieses Script verwenden

```bash
  yarn test:watch
```

Testabdeckung anzeigen lassen

```bash
  yarn coverage
```

<!-- Run Locally -->

### Local ausführen

Starten des Servers im Entwicklungsmodus

> Hinweis: Vergessen Sie nicht, die .env-Variablen zu definieren.

> Falls MySQL nicht auf Ihrem Computer installiert ist, können Sie lokal eine laufende Umgebung einrichten, indem Sie den Server mit [Docker Compose](#ausführen-mit-docker) ausführen.

```bash
  yarn dev
```

Starten des Servers im Produktionsmodus

```bash
  yarn start
```

<!-- Run with Docker -->

### Ausführen mit Docker

Image aus Dockerfile erstellen

```bash
  docker build -t <image-name> .
```

> Verwende die --target Flag, um nur bis zu einer bestimmten Stufe in der Dockerdatei zu bauen.

Docker-Image als Container ausführen

```bash
  docker run --name <container-name> -p <exposed-port>:<port> <image-name>
```

Server und MySQL-Umgebung mit docker compose starten

```bash
  docker-compose up
```
