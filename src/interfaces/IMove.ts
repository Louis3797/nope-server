import type ICard from './ICard';

export interface Move {
  type: 'take' | 'put' | 'nope';
  card1: ICard | null;
  card2: ICard | null;
  card3: ICard | null;
}

export interface MoveHistoryObject {
  id: string;
  moveNumber: number; // number of which move in the game it was
  createdAt: string;
  playerId: string;
  action: Move;
  reason: string;
  compliant: boolean;
}

export interface MoveHistory {
  gameId: string;
  moves: MoveHistoryObject[];
}
