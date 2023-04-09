import type { Server, Socket } from 'socket.io';
import prismaClient from '../config/prisma';
import type { ICreateRoomOptions, IJoinRoomOptions } from 'src/interfaces';
import { playerService } from 'src/service';
import logger from '../middleware/logger';
import type { SocketCallback } from '../types/types';
import {
  GameNotFoundError,
  InvalidRoomSizeError,
  PlayerNotFoundError,
  RoomFullError
} from '../error';

const gameRoomHandler = (io: Server) => {
  /**
   * Sends all available rooms to all connected clients
   */
  const updateAvailableRooms = async () => {
    const availableRooms = await prismaClient.game.findMany({
      where: {
        AND: [{ private: false }, { status: 'WAITING_FOR_MORE_PLAYERS' }]
      },
      select: {
        id: true,
        createdAt: true,
        gameMode: true,
        status: true,
        roomSize: true,
        private: true,
        players: { select: { username: true } }
      }
    });
    io.emit('game-room:available-rooms', availableRooms);
  };

  return (socket: Socket) => {
    logger.info(
      `A new client with socket id: ${socket.id} joined the matchmaking queue`
    );

    /**
     * Creates Game Room
     */
    socket.on('game-room:create', async (options: ICreateRoomOptions) => {
      try {
        // Todo add validation

        // Check room size
        if (options.roomSize < 2 || options.roomSize > 6) {
          throw new InvalidRoomSizeError(
            'The specified room size is not in the range from 2 to 6!'
          );
        }

        // Check if player exists in the database
        const player = await playerService.getPlayerByID(options.id, {
          id: true // select only the id so we don't need to query the whole player
        });

        if (!player) {
          throw new PlayerNotFoundError(
            'Player with the given id does not exist!'
          );
        }

        // Create new game room
        const newRoom = await prismaClient.game.create({
          data: {
            status: 'WAITING_FOR_MORE_PLAYERS',
            roomSize: options.roomSize,
            playerCount: 1,
            private: options.private ?? false,
            players: { connect: { id: options.id } }
          },
          select: {
            id: true,
            createdAt: true,
            gameMode: true,
            status: true,
            roomSize: true,
            private: true
          }
        });

        // Join game room
        await socket.join(`game-room:${newRoom.id}`);

        socket.emit('game-room:create', { success: true, data: newRoom });

        // Update available rooms
        await updateAvailableRooms();
      } catch (error) {
        socket.emit('game-room:create', { success: false, error });
      }
    });

    socket.on(
      'game-room:join',
      async (
        { roomId, playerId }: IJoinRoomOptions,
        callback: SocketCallback<null>
      ) => {
        try {
          // Get the room by ID
          const room = await prismaClient.game.findUnique({
            where: { id: roomId },
            select: {
              roomSize: true,
              playerCount: true,
              status: true,
              players: true
            }
          });

          // Check if the room exists
          if (!room) {
            throw new GameNotFoundError(
              'Game with the given id does not exist!'
            );
          }

          if (
            room.roomSize === room.playerCount ||
            room.status !== 'WAITING_FOR_MORE_PLAYERS'
          ) {
            throw new RoomFullError(
              'The game is already full and the game is in progress!'
            );
          }

          // Get the player by ID
          const player = await playerService.getPlayerByID(playerId, {
            username: true
          });

          // Check if the player exists
          if (!player) {
            throw new PlayerNotFoundError('Player not found');
          }

          const isAlreadyInGame = room.players.find((p) => p.id === playerId);

          if (isAlreadyInGame) {
            callback(null, { success: true });
            return;
          }

          // Add the player to the room
          await prismaClient.game.update({
            where: { id: roomId },
            data: {
              status:
                room.playerCount + 1 === room.roomSize
                  ? 'FULL'
                  : 'WAITING_FOR_MORE_PLAYERS',
              playerCount: { increment: 1 },
              players: { connect: { id: playerId } }
            }
          });

          // Send success response to client
          callback(null, { success: true });

          // Add player to the room
          await socket.join(`game-room:${roomId}`);

          // Emit event to all clients in the room to notify them of the new player
          socket
            .to(`game-room:${roomId}`)
            .emit('game-room:join', `${player.username} has joined the room`);
        } catch (error) {
          // Emit an error message
          if (error instanceof Error) {
            callback(error, {
              success: false,
              error: {
                message: error.message
              }
            });
          } else {
            callback(new Error('An unknown error occurred'), {
              success: false,
              error: {
                message: 'An unknown error occurred'
              }
            });
          }
        }
      }
    );

    // socket.on('game-room:leave',);

    socket.on('disconnect', async () => {
      try {
        const roomId = Object.keys(socket.rooms).find(
          (room) => room !== socket.id
        );
        if (roomId) {
          // Get the game room by ID
          const room = await prismaClient.game.findUnique({
            where: { id: roomId },
            select: {
              playerCount: true,
              status: true,
              players: true
            }
          });

          if (room) {
            // Update player count and remove the player from the game room
            await prismaClient.game.update({
              where: { id: roomId },
              data: {
                playerCount: { decrement: 1 },
                players: { disconnect: { id: socket.data.playerId } }
              }
            });

            // If the game room is empty, delete the game room
            if (room.playerCount === 1) {
              await prismaClient.game.delete({
                where: { id: roomId }
              });
            } else {
              // If the game room is not empty, emit a message to notify other players
              const player = room.players.find(
                (p) => p.id === socket.data.playerId
              );
              if (player) {
                socket
                  .to(`game-room:${roomId}`)
                  .emit(
                    'game-room:leave',
                    `${player.username} has left the room`
                  );
              }
            }

            // Update available rooms
            await updateAvailableRooms();
          }
        }
      } catch (error) {
        logger.error(error);
      }
    });
  };
};

export default gameRoomHandler;
