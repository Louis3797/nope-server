import { type Socket } from 'socket.io';
import type ICard from './ICard';

export interface BasicPlayer {
  id: string;
  username: string;
  socket: Socket;
}

// split this in basic player tournament player and game player
export interface GamePlayer extends BasicPlayer {
  hand: ICard[];
  handSize: number;
  cheated: boolean;
}

export interface TournamentPlayer extends BasicPlayer {
  inMatch: boolean;
  wonMatches: number;
}
