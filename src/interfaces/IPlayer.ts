import { type Socket } from 'socket.io';

export default interface IPlayer {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  socket: Socket;
}
