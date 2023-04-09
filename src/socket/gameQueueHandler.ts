import type { Server, Socket } from 'socket.io';
import logger from '../middleware/logger';

const gameQueueHandler = (_io: Server) => {
  return (socket: Socket) => {
    logger.info(
      `A new client with socket id: ${socket.id} joined the matchmaking queue`
    );

    socket.on('disconnect', () => {
      logger.info(
        `Client with socket id: ${socket.id} disconnected from the matchmaking queue`
      );
    });
  };
};

export default gameQueueHandler;
