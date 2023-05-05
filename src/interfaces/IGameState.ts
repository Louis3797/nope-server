import type { Player } from '@prisma/client';
import type { GamePlayer, ICard, Move, MoveHistoryObject } from '.';

export interface State {
  players: GamePlayer[];
  currentPlayerIdx: number | null;
  currentPlayer: Pick<Player, 'id' | 'username'> | null;
  prevPlayerIdx: number | null;
  prevPlayer: Pick<Player, 'id' | 'username'> | null;
  winner: GamePlayer | null;

  direction: 1 | -1; // 1 for clockwise, -1 for counter clockwise

  topCard: ICard | null;
  lastTopCard: ICard | null;
  drawPile: ICard[];
  discardPile: ICard[]; // discarded cards

  prevTurnCards: ICard[]; // last placed card
  lastMove: Move | null;
}

export interface IGameState {
  // methods
  checkMove: (move: Move) => boolean;
  updateState: (move: Move) => State | null;
  isWon: () => boolean;
  getHistory: () => Array<{
    move: MoveHistoryObject | null;
    state: State;
  }>;
  getState: () => State;
}
