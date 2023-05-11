import { type RemoteSocket } from 'socket.io';
import type ICard from './ICard';
import type { Player } from '@prisma/client';
import type { ServerToClientEvents, SocketData } from '../types/socket';

export type BasicPlayer = Pick<Player, 'id' | 'username'> & {
  socket: RemoteSocket<ServerToClientEvents<false>, SocketData>;
};

// split this in basic player tournament player and game player
export interface GamePlayer extends BasicPlayer {
  hand: ICard[];
  cheated: boolean;
}
