import type { GameStatus, MatchStatus, Player } from '@prisma/client';
import type { Move } from '../interfaces/IMove';

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

export interface MatchInfoPayload {
  message: string;
  tournamentId: string;
  match: {
    id: string;
    round: number;
    bestOf: number;
    status: MatchStatus;
    opponents: Array<Pick<Player, 'id' | 'username'> & { points: number }>;
    winner: (Pick<Player, 'id' | 'username'> & { points: number }) | null;
  } | null;
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
  'match:info': (data: MatchInfoPayload) => void;
  'game:makeMove': (
    data: {
      message: string;
      timeout: number;
    },
    callback: (...args: WithTimeoutAck<isSender, [Move]>) => void
  ) => void;

  'game:state': (message: string) => void;
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
    callback: SocketCallback<{
      tournamentId: string;
      currentSize: number;
      bestOf: number;
      players: Array<{
        id: string;
        username: string;
      }>;
    }>
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
