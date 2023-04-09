import type IPlayer from './IPlayer';

export interface IGameQueue {
  players: IPlayer[];
}

export interface IGameQueueSocketOptions {
  wantedPlayerAmount: number | null; // null means that player wants to join any game
}
