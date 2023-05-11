# Changelog 26.04.2023

---

## Added

### Rest API

`POST /api/verify-token` ist ein neuer Endpoint damit die Frontends checken können ob deren Zugangtokens gültig sind

### Socket.io

#### Client -> Server

`tournament:create` Erstellt ein neues Tunier

`tournament:join` Lässt ein Spieler ein Tunier beitreten

`tournament:leave` Lässt ein Spieler ein Tunier verlassen

#### Server -> Client

`list:tournaments` Liste aller verfügbaren Tuniere

`tournament:playerInfo` Informiert Spieler in Tunieren wenn andere Spieler beitreten oder es verlassen

`tournament:info` Informiert über andere Dinge im Tunier

---

## Updated

### Rest API

`POST /api/auth/login` gibt nun auch bei erfolgreichen login ein user object zurück

### Socket.io

---

## Removed

### Rest API

### Socket.io

<!------------------------------------------------>

# Changelog 11.05.2023

---

## Added

- Matchmaking Algorithmus
- Match Logic
- Spielelogik (nur mit Farbkarten)

### Rest API

### Socket.io

#### Client -> Server

`tournament:start` Lässt den Host des Tunieres das Tunier starten. Somit werden auch die Spieler in Matches verteilt um gegeneinander zu spielen

#### Server -> Client

`match:invite` Schickt Spielern bei Tunierstart Match Einladungen die man per Acknowledment annehmen kann

`match:info` Schickt Spielern Updated zu ihren aktuellen Match in dem sie sich befinden

`game:makeMove` Fordert Spieler (die sich in einen Spiel befinden) auf einen Zug zu machen und diesen per Acknowledgment in 10 Sekunden an den Server zu schicken

`game:state` Schickt den aktuellen Zustand des Spieles an die Spieler die sich in einen Spiel befinden

`game:status` Schickt den Spielern die ein Spiel gegeneinander Spielen Infos zu Beginn und Ende des Spiels

---

## Updated

### Rest API

### Socket.io

#### Client -> Server

#### Server -> Client

- `tournament:info` gibt nun den richtigen Payload zurück

---

## Removed

### Rest API

### Socket.io

#### Client -> Server

#### Server -> Client

- `tournament:status` wurde durch `tournament:info` ersetzt
