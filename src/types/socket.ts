import type { GameStatus } from '@prisma/client';
import type { BasicPlayer } from '../interfaces';

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
    players: Array<Pick<BasicPlayer, 'id' | 'username'>>;
  }) => void;
  'tournament:info': (message: string) => void;
  'tournament:status': (message: string) => void;
  'game:status': (message: string) => void;
  'game:state': (message: string) => void;
  'game:makeMove': (
    arg: number,
    callback: (...args: WithTimeoutAck<isSender, [string]>) => void
  ) => void;
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
