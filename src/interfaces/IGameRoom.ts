import type ICard from './ICard';
import type { GamePlayer } from './IPlayer';

export default interface IGameRoom {
  gameId: string;
  started: boolean;
  maxRoomSize: 2 | 3 | 4 | 5 | 6;
  playerCount: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  players: GamePlayer[];
  currentPlayerIndex: number | null;
  currentPlayer: GamePlayer | null;

  direction: 1 | -1; // 1 for clockwise, -1 for counter clockwise

  topCard: ICard | null;
  drawPile: ICard[];
  discardPile: ICard[]; // discarded cards
  drawPileSize: number;
}
