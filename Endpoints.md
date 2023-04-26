# Endpoints

## Rest API

### `POST /api/auth/register`

Registriert einen neuen User

Request Payload:

```json
{
  "username": "username",
  "password": "password",
  "firstname": "firstname",
  "lastname": "lastname"
}
```

Response:

Statuscode: 201

```json
{
  "message": "New player created"
}
```

### `POST /api/auth/login`

Authentifiziert einen User und vergibt ein Zugangstoken

Request Payload:

```json
{
  "username": "username",
  "password": "password"
}
```

Response:

```json
{
  "accessToken": "jwt",
  "user": {
    "id": "id",
    "username": "username",
    "firstname": "firstname",
    "lastname": "lastname"
  }
}
```

### `POST /api/verify-token`

Verifiziert das mit gegebende Zugangstoken und gibt die gespeicherten Nutzerdaten zurück

Request Payload:

```json
{
  "token": "jwt"
}
```

Response:

Statuscode: 200

```json
{
  "user": {
    "id": "id",
    "username": "username"
  }
}
```

## Socket.io

Wir nutzen Socket.io für alles bei dem wir echt zeit

### Client -> Server

#### `tournament:create`

Erstellt ein Tunier mit den spezifizierten Optionen

##### Payload

```json
{
  "numBestOfMatches": 3 // ungerade zahlen >2
}
```

##### Response

Der Server bestätigt das Event mit einen Acknowledgment

Success:

```json
{
  "success": true,
  "data": {
    "tournamentId": "id",
    "currentSize": 1,
    "bestOf": 5 // anzahl der best of matches
  },
  "error": null
}
```

Error:

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "..."
  }
}
```

#### `tournament:create`

Erstellt ein Tunier mit den spezifizierten Optionen

##### Payload

```json
{
  "numBestOfMatches": 5 // ungerade zahlen >2
}
```

##### Response

Der Server bestätigt das Event mit einen Acknowledgment

Success:

```json
{
  "success": true,
  "data": {
    "tournamentId": "id",
    "currentSize": 1,
    "bestOf": 5 // anzahl der best of matches
  },
  "error": null
}
```

Error:

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "..."
  }
}
```

#### `tournament:join`

Lässt den Client das Tunier mit der spezifizierten tournamentId beitreten

##### Payload

```json
{
  "tournamentId": "id"
}
```

##### Response

Der Server bestätigt das Event mit einen Acknowledgment

Success:

```json
{
  "success": true,
  "data": {
    "tournamentId": "id",
    "currentSize": 1,
    "bestOf": 5,
    "players": [
      {
        "id": "playerId",
        "username": "username"
      }
    ]
  },
  "error": null
}
```

Error:

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "..."
  }
}
```

#### `tournament:leave`

Lässt den Spieler das Tunier in dem er sich aufhält verlassen

##### Response

Der Server bestätigt das Event mit einen Acknowledgment

Success:

```json
{
  "success": true,
  "data": null,
  "error": null
}
```

Error:

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "..."
  }
}
```

### Server -> Client

#### `list:tournaments`

Schickt allen Client die mit dem Socket.io Server verbunden sind updated über die verfügbaren tuniere denen man beitreten kann

> Wird jedesmal wenn ein Client ein Tunier erstellt oder beitritt geupdated und an alle Clients gesendet

```json
{
  "tournaments": [
    {
      "id": "tournamentId",
      "createdAt": "date", // 2023-04-14T19:16:17.907Z
      "status": "WAITING_FOR_MORE_PLAYERS",
      "currentSize": 1,
      "players": [
        {
          "username": "username"
        }
      ]
    },
    {
      "id": "tournamentId",
      "createdAt": "date",
      "status": "WAITING_FOR_MORE_PLAYERS",
      "currentSize": 2,
      "players": [
        {
          "username": "username"
        },
        {
          "username": "username2"
        }
      ]
    }
    ...
    ...
    ...
  ]
}
```

#### `tournament:playerInfo`

Sendet allen Clients im Tunier updates wenn andere Clients beitreten oder austreten

```json
{
  "message": "...",
  "tournamentId": "id",
  "currentSize": 1,
  "bestOf": 5,
  "players": [
    {
      "id": "playerId",
      "username": "username"
    }
  ]
}
```

#### `tournament:info`

Sendet allen Clients im Tunier updates über verschiedene Sachen (Wechsel des Hosts, Matches, etc...)

```json
{
  "message": "...."
}
```
