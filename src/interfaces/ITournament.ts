import { type Server } from 'socket.io';
import type IGameRoom from './IGameRoom';
import type { TournamentPlayer } from './IPlayer';

export interface ITournamentRoom {
  tournamentId: string;
  started: boolean;

  playerCount: number;
  players: TournamentPlayer[];
  host: string;

  matches: Array<{ player1: string; player2: string }>;
  playedMatches: Match[];
  numBestOfMatches: number;
  numMatches?: number; // number of all matches that will be played

  isCompleted: boolean;
  currentRound: number;
  io: Server;
}

interface Match {
  gameId: string;
  started: boolean;
  maxRoomSize: 2;
  playerCount: 0 | 1 | 2;

  players: TournamentPlayer[];
  games: IGameRoom[];
}
