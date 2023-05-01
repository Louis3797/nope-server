import type { GameStatus, Player } from '@prisma/client';

// * Payload types

export interface TournamentInfoPayload {
  message: string;
  tournamentId: string;
  currentSize: number;
  status: GameStatus;
  players: Array<{
    id: string;
    username: string;
    score: number; // won matches
  }>;

  winner: {
    id: string;
    username: string;
    score: number;
  } | null;
  host: {
    id: string;
    username: string;
  };
}

// * Socket types

export type SocketCallback<T> = (response?: SocketResponse<T>) => void;

export interface SocketResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    message: string;
  } | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type WithTimeoutAck<
  isSender extends boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args extends any[]
> = isSender extends true ? [Error, ...args] : args;

export interface ServerToClientEvents<isSender extends boolean = false> {
  'list:tournaments': (
    availableRooms: Array<{
      status: GameStatus;
      id: string;
      createdAt: Date;
      currentSize: number;
      players: Array<{
        username: string;
      }>;
    }>
  ) => void;

  'tournament:playerInfo': (data: {
    message: string;
    tournamentId: string;
    currentSize: number;
    bestOf: number;
    players: Array<Pick<Player, 'id' | 'username'>>;
  }) => void;
  'tournament:info': (data: TournamentInfoPayload) => void;
  'game:status': (data: {
    message: string;
    gameId: string;
    matchNumber: number;
    players: Array<{
      id: string;
      username: string;
      score: number; // won games
    }>;

    winner: {
      id: string;
      username: string;
      score: number;
    } | null;
  }) => void;
  'game:state': (message: string) => void;
  'match:invite': (
    data: {
      message: string;
      matchId: string;
      players: Array<Pick<Player, 'id' | 'username'>>;
      invitationTimeout: number; // time when the invitation ends. Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (...args: WithTimeoutAck<isSender, [MatchInviteResponse]>) => void
  ) => void;
  'game:makeMove': (
    arg: number,
    callback: (...args: WithTimeoutAck<isSender, [string]>) => void
  ) => void;
  'match:info': (message: string) => void;
}

export interface ClientToServerEvents {
  'tournament:create': (
    numBestOfMatches: number,
    callback: SocketCallback<{
      tournamentId: string;
      currentSize: number;
      bestOf: number;
    }>
  ) => void;
  'tournament:join': (
    tournamentId: string,
    callback: SocketCallback<null>
  ) => void;
  'tournament:leave': (callback: SocketCallback<null>) => void;
  'tournament:start': (callback: SocketCallback<null>) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user: {
    username: string;
    id: string;
  };
  gameId?: string; // if player is in a game this id will be defined
  tournamentId?: string; // if player is in tournament this id will be defined
}

export interface MatchInviteResponse {
  accepted: boolean;
  id: string; // player id
}
