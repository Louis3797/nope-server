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

### Client -> Server

#### `tournament:create`

Erstellt ein Tunier mit den spezifizierten Optionen

##### Payload

```json
// kein JSON Objekt
"numBestOfMatches": 3 // ungerade zahlen, n > 2 und n < 8

```

```ts
// Beispiel:
socket.emit('tournament:create', 3, (data) => {
  // logic
});
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
"tournamentId": "id" // kein JSON Objekt
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

#### `tournament:start`

Lässt den Spieler das Tunier in dem er sich aufhält starten

> Kann nur vom Host des Tuniers veranlasst werden

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

Sendet allen Clients im Tunier updates über verschiedene Sachen (Tunier start/ende, Wechsel des Hosts, Matches, etc...)

```json
{
  "message": "...",
  "tournamentId": "tournament id",
  "currentSize": 2,
  "status:": "status" // "IN_PROGRESS" | "FINISHED" | "WAITING_FOR_MORE_PLAYERS"
  "players": [
    {
      "id": "player id",
      "username": "player username",
      "score": 2 // gewonnene matches
    }
    ...
    ...
    ...
  ],
  "winner": { // kann auch null sein
    "id": "winner id",
    "username": "winner username",
    "score": 2
  },
  "host": {
    "id": "hostId",
    "username": "host username"
  }
}
```

#### `match:invite`

Sendet einem Spieler, der sich in einem laufenden Turnier befindet und auf ein neues Spiel wartet, eine Einladung zu einem Match.

> Die Einladung muss per Acknowledgment in 10 Sekunden angenommen werden

```json
{
  "message": "....",
  "matchId": "match id",
  "players": [
    // Array hat immer eine länge von 2
    {
      "id": "player1 id",
      "username": "player1 username"
    },
    {
      "id": "player2 id",
      "username": "player2 username"
    }
  ],
  "invitationTimeout": 1683482639 // Zeitpunkt wann die Einladung abläuft, in Unixzeit
}
```

Acknowledgment Payload

```json
{
  "accepted": true, // boolean
  "id": "player id" // id des Spielers
}
```

Client Beispiel in JavaScript

```js
socket.on("match:invite", (data, ack) => {
  console.log(data);
  { accepted: true, id: "my id" });
});
```

#### `match:info`

Sendet den Spielern Informationen über verschiendene Events wie den Spielstart, Ablehnung der Match Einladung des Gengners, Fehlern im Matchmaking, Erfolg der Match Suche, Match Ende, etc....

```json
{
  "message": "...",
  "tournamentId": "tournament id",
  "match": {
    "id": "match id",
    "round": 0, // 0 - bestOf
    "bestOf": 5,
    "status": "match status", // "PENDING" | "IN_PROGRESS" | "FINISHED"
    "opponents": [
      {
        "id": "player1 id",
        "username": "player1 username",
        "points": 0,
      },
      {
        "id": "player2 id",
        "username": "player2 username",
        "points": 0,
      }
    ],
    "winner": {
      {
        "id": "winner id",
        "username": "winner username",
        "points": 0,
      },
    } // kann auch null sein
  }
}
```

#### `game:makeMove`

Fordert einen Spieler in einen aktiven Spiel auf einen Zug zu machen

> Der zu machende Zug des Spielers muss in 10 Sekunden als Acknowledgment zum Server gesendet werden.

```json
{
  "message": "...",
  "timeout": 1683482639 // Zeitpunkt des Timeouts, in Unixzeit
}
```

Acknowledgment Payload

```json
{
  "type": "put", // 'take' | 'put' | 'nope'
  "card1": {
    "type": "number", // "number" | 'joker' | 'reboot' | 'see-through' | 'selection';
    "color": "red", // 'red' | 'blue' | 'green' | 'yellow' | 'red-yellow' | 'blue-green' | 'yellow-blue' | 'red-blue' | 'red-green' | 'yellow-green' | 'multi' | null. null wenn action oder joker karte
    "value": 1, // null wenn action oder joker karte
    "select": 1, // 1 oder -1 null wenn keine selection karte
    "selectValue": 1, // null wenn keine selection karte
    "selectedColor": "red" // 'red' | 'blue' | 'green' | 'yellow' | null;
  },
  "card2": {
    ...
  },
  "card3": {
    ...
  },
  "reason": "Because I can!" // Begründung des Zuges
}
```

#### `game:state`

Wird einen Spieler in einen aktiven Spiel geschickt wenn sich der Stand des Spielers ändert.

```json
{
  "matchId": "match id",
  "gameId": "game id",
  "topCard": {}, // oberste Karte, sehe ICard Type unten
  "lastTopCard": {}, // letzte obere Karte
  "drawPileSize": 19,
  "players": [
    {
      "id": "player1 id",
      "username": "player1 username",
      "handSize": 4
    },
    {
      "id": "player2 id",
      "username": "player2 username",
      "handSize": 3
    }
  ],
  "hand": [{}, {}], // ICard Array
  "handSize": 4,
  "currentPlayer": {
    "id": "player1 id",
    "username": "player1 username"
  },
  "currentPlayerIdx": 0,
  "prevPlayer": {
    "id": "player2 id",
    "username": "player2 username"
  },
  "prevPlayerIdx": 1,
  "prevTurnCards": [{}, {}], // ICards array
  "lastMove": {} // Von Type Move (siehe unten) oder null
}
```

#### `game:status`

Wird einen Spieler in einen aktiven Spiel geschickt wenn das Spiel endet oder ein Spieler disqualifiziert wird

```json
{
  "message": "...",
  "winner": {
    "id": "winner id",
    "username": "winner username",
    "points": 0
  }
}
```

## Types

### ICard

```ts
interface ICard {
  type: 'number' | 'joker' | 'reboot' | 'see-through' | 'selection';
  color:
    | 'red'
    | 'blue'
    | 'green'
    | 'yellow'
    | 'red-yellow'
    | 'blue-green'
    | 'yellow-blue'
    | 'red-blue'
    | 'red-green'
    | 'yellow-green'
    | 'multi'
    | null; // null for action cards or joker
  value: number | null; // null for action cards or joker
  select?: number | null; // is only not null if the selection card is played
  selectValue?: number | null;
  selectedColor?: 'red' | 'blue' | 'green' | 'yellow' | null;
}
```

### Move

```ts
interface Move {
  type: 'take' | 'put' | 'nope';
  card1: ICard | null;
  card2: ICard | null;
  card3: ICard | null;
  reason: string;
}
```
