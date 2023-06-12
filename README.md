<div align="center">

  <h1>Nope Multiplayer Server</h1>
  
<!-- Badges -->
<p>
  <a href="https://github.com/Louis3797/nope-server/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/Louis3797/nope-server" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/Louis3797/nope-server" alt="last update" />
  </a>
  <a href="https://github.com/Louis3797/nope-server/issues/">
    <img src="https://img.shields.io/github/issues/Louis3797/nope-server" alt="open issues" />
  </a>
</p>

<h5>
    <a href="https://nope-server.azurewebsites.net/docs/">Swagger Dokumentation</a>
  <span> · </span>
   <a href="https://github.com/Louis3797/nope-server/blob/main/Endpoints.md">Socket.io Event Dokumentation</a>
  <span> · </span>
    <a href="https://github.com/Louis3797/nope-server/issues/">Bug melden</a>
  <span> · </span>
    <a href="https://github.com/Louis3797/nope-server/issues/">Feature anfordern</a>
  </h5>
</div>

<!-- Table of Contents -->

# Inhaltsübersicht

- [Inhaltsübersicht](#inhaltsübersicht)
  - [Über das Projekt](#über-das-projekt)
    - [Tech Stack](#tech-stack)
    - [Architektur](#architektur)
    - [Endpoints](#endpoints)
    - [Projektstruktur](#projektstruktur)
    - [Datenbank](#datenbank)
    - [Diagramme](#diagramme)
      - [Login und Register Sequenzdiagramm](#login-und-register-sequenzdiagramm)
      - [Create Tournament Sequenzdiagramm](#create-tournament-sequenzdiagramm)
      - [Join Tournament Sequenzdiagramm](#join-tournament-sequenzdiagramm)
      - [Matchmaking Ablaufdiagramm](#matchmaking-ablaufdiagramm)
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

Der Nope Multiplayer Game Server wird für die Abwicklung von Online-Spielen für das Nope-Kartenspiel verwendet. Er bietet sowohl eine REST-API als auch eine WebSocket-Verbindung und ermöglicht es Spielern, in Echtzeit gegeneinander anzutreten. Der Server wurde mit Express.js, Socket.io und TypeScript entwickelt.

Der Server kann unter dieser URL angesprochen werden `https://nope-server.azurewebsites.net`

<!-- TechStack -->

### Tech Stack

[![Technologies](https://skillicons.dev/icons?i=ts,nodejs,express,mysql,docker,prisma&perline=13)](https://skillicons.dev)

---

### Architektur

![Architectur](/assets/architecture.png)

<!-- Endpoints -->

### Endpoints

Der Server bietet eine umfassende API auf die per Websockets (per Socket.io) oder REST API zugegriffen werden kann.

Um einen guten Einblick in die API des Servers zugeben gibt es zum einen die [Endpoints.md](https://github.com/Louis3797/nope-server/blob/main/Endpoints.md), in der die Socket.io Events zu finden sind, die die Clients anzusprechen. Zudem ist die REST API des Servers mit Swagger dokumentiert [Swagger Dokumentation](https://nope-server.azurewebsites.net/docs/)

Der Server stellt eine umfassende API zur Verfügung, auf die über Websockets (mit Socket.io) oder die REST API zugegriffen werden kann.

Um einen umfassenden Überblick über die API des Servers zu erhalten, stehen zwei Ressourcen zur Verfügung. Die Datei [Endpoints.md](https://github.com/Louis3797/nope-server/blob/main/Endpoints.md) enthält eine Liste der Socket.io-Ereignisse, die von den Clients verwendet werden können. Zusätzlich ist die REST API des Servers mit Swagger dokumentiert und kann unter [Swagger Dokumentation](https://nope-server.azurewebsites.net/docs/) eingesehen werden.

<!-- Project Structure -->

### Projektstruktur

```txt
.
├── api-test            REST API Tests
│   ├── postman         Postman Tests
│   └── thunder-client  Thunder Client Tests
├── assets              Assets (Bilder, Diagramme, etc.)
├── prisma
│   └── migrations      Prisma Migrationen
├── src
│   ├── config          Config Dateien
│   ├── controller      Controller
│   ├── error           Custom Error Klassen
│   ├── interfaces      Typescript Interfaces
│   ├── middleware      Middlewares
│   │   └── socket      Socket.io Middlewares
│   ├── model           Modele
│   ├── routes          Routen/Endpoints
│   ├── service         Services
│   ├── socket          Socket.io Sezifische Controller
│   ├── types           Typescript Types
│   ├── utils           Utility Klassen und Funktionen
│   └── validations     Validierungs Middlewares
└── test                Tests
    ├── integration     Integration Tests
    └── unit            Unit Tests
```

<!-- Database -->

### Datenbank

Unser Server nutzt MySQL als primäres Datenbankmanagementsystem zur Speicherung und Verwaltung aller relevanten Daten. MySQL ist ein beliebtes und weit verbreitetes relationales Open-Source-Datenbanksystem, das eine effiziente, sichere und skalierbare Speicherung und Abfrage von Daten ermöglicht.

Um die Verwaltung der in der MySQL-Datenbank gespeicherten Daten zu vereinfachen und zu rationalisieren, setzen wir Prisma ein, ein modernes, typsicheres ORM, das verschiedene Datenbanken, darunter auch MySQL, unterstützt.

Prisma hilft uns, Datenbankabfragen in einer besser lesbaren und intuitiven Weise zu schreiben, was die Verwaltung der in unserer MySQL-Datenbank gespeicherten Daten erleichtert. Durch den Einsatz von Prisma als ORM unserer Wahl können wir außerdem sicherstellen, dass unsere Anwendung skalierbar, effizient und wartungsfreundlich bleibt.

Wenn Sie sich für die Struktur unserer Datenbank interessieren, können Sie einen Blick auf das unten dargestellte Datenmodell werfen, das einen Überblick über die Tabellen, Spalten und Beziehungen innerhalb der Datenbank gibt.

![ERD](assets/mysql_erd.png)

<!-- Diagramme -->

### Diagramme

#### Login und Register Sequenzdiagramm

![Auth Sequenzdiagramm](assets/sequence_dia_auth.drawio.png)

#### Create Tournament Sequenzdiagramm

![Create Tournament Sequenzdiagramm](assets/sequence_dia_socket_create_tournament.drawio.png)

#### Join Tournament Sequenzdiagramm

![Join Tournament Sequenzdiagramm](assets/sequence_dia_socket_join_tournament.drawio.png)

#### Matchmaking Ablaufdiagramm

![Matchmaking Ablaufsdiagramm](assets/matchmaking.drawio.png)

<!-- Env Variables -->

### Umgebungsvariablen

Um dieses Projekt auszuführen, müssen Sie die folgenden Umgebungsvariablen zu Ihrer .env-Datei hinzufügen

```yml
# App's running environment
# Possible values: test, production, development
NODE_ENV=

# App's running port
PORT=

HOST=

# Cors origin url
# Example: https://example.com or for multiple origins
# https://example.com|https://example2.com|https://example3.com or simple * to allow all origins
CORS_ORIGIN=

# Run node -e "console.log(require('crypto').randomBytes(256).toString('base64'));" in your console to generate a secret
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRE=

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
  git clone https://github.com/Louis3797/nope-server.git

  cd nope-server

  cp .env.example .env

  yarn install # install dependencies

  yarn husky install

  yarn prisma migrate dev --name init

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
  yarn docker:prod
```
