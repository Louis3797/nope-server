import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import compressFilter from './utils/compressFilter.util';
import { errorHandler } from './middleware/errorHandler';
import config from './config/config';
import { xssMiddleware } from './middleware/xssMiddleware';
import { createServer } from 'http';
import { Server } from 'socket.io';
import {
  authRouter,
  gameRouter,
  matchRouter,
  playerRouter,
  tokenRouter,
  tournamentRouter
} from './routes';
import authLimiter from './middleware/authLimiter';
import isAuthSocket from './middleware/socket/isAuthSocket';
import logger from './middleware/logger';
import prismaClient from './config/prisma';
import {
  GameError,
  InvalidParticipantsError,
  NotFoundError,
  PrivilegeError,
  SocketDataNotDefinedError
} from './error';
import { playerService } from './service';
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketCallback,
  SocketData
} from './types/socket';
import httpStatus from 'http-status';
import { PriorityQueue } from './utils';
import { matchmaking } from './socket/matchmaking';
import type { Player } from '@prisma/client';
import { getTournamentInfo } from './service/tournament.service';

export const matchMakingQueues = new Map<
  string,
  PriorityQueue<Pick<Player, 'id' | 'username'>>
>();

const app: Express = express();
const server = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: config.cors.origin,
    allowedHeaders: ['GET', 'POST']
  },
  connectionStateRecovery: {
    // default values
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: false
  }
});

// Helmet is used to secure this app by configuring the http-header
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(xssMiddleware());

app.use(cookieParser());

// Compression is used to reduce the size of the response body
app.use(compression({ filter: compressFilter }));

app.use(
  cors({
    // origin is given a array if we want to have multiple origins later
    // origin: String(config.cors.origin).split('|'),
    origin: config.cors.origin,
    credentials: true
  })
);
app.use('/api/auth', authLimiter, authRouter);

app.use('/api/player', playerRouter);

app.use('/api/tournament', tournamentRouter);

app.use('/api/match', matchRouter);

app.use('/api/game', gameRouter);

app.use('/api', tokenRouter);

const updateAvailableTournaments = async () => {
  const availableRooms = await prismaClient.tournament.findMany({
    where: {
      status: 'WAITING_FOR_MORE_PLAYERS'
    },
    select: {
      id: true,
      createdAt: true,
      status: true,
      currentSize: true,
      players: { select: { username: true } }
    }
  });
  io.emit('list:tournaments', availableRooms);
};

io.use(isAuthSocket);

io.on('connection', async (socket) => {
  logger.info(`A new client with socket id: ${socket.id} connected`);

  io.emit(
    'list:tournaments',
    await prismaClient.tournament.findMany({
      where: {
        status: 'WAITING_FOR_MORE_PLAYERS'
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
        currentSize: true,
        players: { select: { username: true } }
      }
    })
  );

  socket.on(
    'tournament:create',
    async (
      numBestOfMatches: number,
      callback: SocketCallback<{
        tournamentId: string;
        currentSize: number;
        bestOf: number;
      }>
    ) => {
      try {
        if (
          numBestOfMatches < 3 ||
          numBestOfMatches > 7 ||
          numBestOfMatches % 2 === 0
        ) {
          throw new GameError(
            'numBestOfMatches must be a odd number and in range of 3 to 7!',
            httpStatus.BAD_REQUEST
          );
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { id } = socket.data.user!;

        // Check if player exists in the database
        const player = await playerService.getPlayerByID(id, {
          id: true // select only the id so we don't need to query the whole player
        });

        if (!player) {
          throw new NotFoundError('Player with the given id does not exist!');
        }

        // Check if client is in a other room
        if (socket.rooms.size > 1) {
          throw new GameError(
            'You cannot create a tournament while your in a other room',
            httpStatus.FORBIDDEN
          );
        }

        // Create new tournament
        const newTournament = await prismaClient.tournament.create({
          data: {
            status: 'WAITING_FOR_MORE_PLAYERS',
            currentSize: 1,
            bestOf: numBestOfMatches,
            players: { connect: { id } }, // connect player with tournament in database
            host: { connect: { id } }
          },
          select: {
            id: true,
            currentSize: true,
            bestOf: true
          }
        });

        // define tournamentId in socket.data
        socket.data.tournamentId = newTournament.id;

        // Join game room
        await socket.join(`tournament:${newTournament.id}`);

        callback({
          success: true,
          data: {
            tournamentId: newTournament.id,
            currentSize: newTournament.currentSize,
            bestOf: newTournament.bestOf
          },
          error: null
        });

        // Update available rooms
        await updateAvailableTournaments();
      } catch (error) {
        logger.error(error);
        if (error instanceof Error) {
          callback({
            success: false,
            data: null,
            error: {
              message: error.message
            }
          });
        } else {
          callback({
            success: false,
            data: null,
            error: {
              message: 'An unknown error occurred'
            }
          });
        }
      }
    }
  );

  socket.on('tournament:join', async (tournamentId, callback) => {
    try {
      // * isAuthSocket middleware defines this property
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { id: playerId } = socket.data.user!;

      // Check if client is in a other room
      if (socket.rooms.size > 1) {
        throw new GameError(
          'You cannot join a Tournament while your in a other room',
          httpStatus.FORBIDDEN
        );
      }

      // Get the room by ID
      const room = await prismaClient.tournament.findUnique({
        where: { id: tournamentId },
        select: {
          id: true,
          currentSize: true,
          status: true,
          players: true
        }
      });

      // Check if the room exists
      if (!room) {
        throw new NotFoundError('Tournament with the given id does not exist!');
      }

      // Get the player by ID
      const player = await playerService.getPlayerByID(playerId, {
        id: true,
        username: true
      });

      // Check if the player exists
      if (!player) {
        throw new NotFoundError('Player not found');
      }

      const isAlreadyInGame = room.players.find((p) => p.id === player.id);

      if (isAlreadyInGame) {
        throw new GameError(
          'Your already in the tournament',
          httpStatus.BAD_REQUEST
        );
      }

      // Add the player to the tournament room
      const updatedRoomData = await prismaClient.tournament.update({
        where: { id: tournamentId },
        data: {
          status: 'WAITING_FOR_MORE_PLAYERS',
          currentSize: { increment: 1 },
          players: { connect: { id: player.id } }
        },
        select: {
          currentSize: true,
          id: true,
          bestOf: true,
          players: {
            select: {
              id: true,
              username: true
            }
          }
        }
      });

      socket.data.tournamentId = room.id;
      // Send success response to client
      callback({
        success: true,
        data: {
          tournamentId: updatedRoomData.id,
          currentSize: updatedRoomData.currentSize,
          bestOf: updatedRoomData.bestOf,
          players: updatedRoomData.players
        },
        error: null
      });

      // Add player to the room
      await socket.join(`tournament:${tournamentId}`);

      // Emit event to all clients in the room to notify them of the new player
      io.in(`tournament:${tournamentId}`).emit('tournament:playerInfo', {
        message: `${player.username} has joined the tournament`,
        tournamentId: updatedRoomData.id,
        currentSize: updatedRoomData.currentSize,
        bestOf: updatedRoomData.bestOf,
        players: updatedRoomData.players
      });

      await updateAvailableTournaments();
    } catch (error) {
      logger.error(error);
      if (error instanceof Error) {
        callback({
          success: false,
          data: null,
          error: {
            message: error.message
          }
        });
      } else {
        callback({
          success: false,
          data: null,
          error: {
            message: 'An unknown error occurred'
          }
        });
      }
    }
  });

  socket.on('tournament:leave', async (callback: SocketCallback<null>) => {
    try {
      const { tournamentId, user } = socket.data;

      if (!user) {
        throw new GameError(
          'Your user id is not defined in the socket.data',
          httpStatus.FORBIDDEN
        );
      }

      if (!tournamentId) {
        throw new GameError(
          'Your currently not in a tournament',
          httpStatus.BAD_REQUEST
        );
      }

      // get info about tournament
      const tournamentInfo = await prismaClient.tournament.findUnique({
        where: { id: tournamentId },
        select: {
          hostId: true,
          currentSize: true,
          status: true,
          players: { select: { id: true, username: true } }
        }
      });

      // check if tournament was found
      if (!tournamentInfo) {
        throw new NotFoundError(
          `Tournament with the id ${tournamentId} not found`
        );
      }

      if (tournamentInfo.status === 'IN_PROGRESS') {
        throw new GameError(
          'You cant leave a tournament that is in progress.',
          httpStatus.FORBIDDEN
        );
      }
      // check if leaving client is host
      if (user.id === tournamentInfo.hostId) {
        // if the player that leaves is the host than we must
        // check if he is the last player in the tournament
        // and if not we must make a other player in the tournament the host

        if (tournamentInfo.currentSize > 1) {
          // client is last player in tournament

          // get another player in the tournament that is not the host
          const newHost = tournamentInfo.players.find(
            // cannot be undefined because we checked if there are other players
            (p) => p.id !== tournamentInfo.hostId
          );
          const updatedTournamentHost = await prismaClient.tournament.update({
            where: { id: tournamentId },
            data: {
              host: { connect: { id: newHost?.id as string } }
            },
            select: {
              id: true,
              host: {
                select: { username: true }
              }
            }
          });

          const tInfo = await getTournamentInfo(
            tournamentId,
            `${updatedTournamentHost.host.username} is the new host of the tournament`
          );

          socket
            .to(`tournament:${tournamentId}`)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-assertion
            .emit('tournament:info', tInfo!);
        }
      }

      // update tournament in db
      const tournamentData = await prismaClient.tournament.update({
        where: { id: tournamentId },
        data: {
          players:
            tournamentInfo.status === 'WAITING_FOR_MORE_PLAYERS'
              ? { disconnect: { id: user.id } }
              : {}, // if tournament ended than dont disconnect
          currentSize: { decrement: 1 }
        },
        select: { id: true, currentSize: true, bestOf: true, players: true }
      });

      // check if the client was the last player in the tournament
      if (
        tournamentInfo.currentSize === 1 &&
        tournamentInfo.status === 'WAITING_FOR_MORE_PLAYERS'
      ) {
        // delete if last player left
        await prismaClient.tournament.delete({
          where: { id: tournamentId }
        });
      }

      // socket leave room
      await socket.leave(`tournament:${tournamentId}`);

      // We only need to emit if the tournament is not empty
      if (tournamentInfo.currentSize > 1) {
        socket.to(`tournament:${tournamentId}`).emit('tournament:playerInfo', {
          message: `${user.username} has left the tournament`,
          tournamentId: tournamentData.id,
          currentSize: tournamentData.currentSize,
          bestOf: tournamentData.bestOf,
          players: tournamentData.players
        });
      }
      // callback
      callback({
        success: true,
        data: null,
        error: null
      });

      await updateAvailableTournaments();
    } catch (error) {
      logger.error(error);
      if (error instanceof Error) {
        callback({
          success: false,
          data: null,
          error: {
            message: error.message
          }
        });
      } else {
        callback({
          success: false,
          data: null,
          error: {
            message: 'An unknown error occurred'
          }
        });
      }
    }
  });

  socket.on('tournament:start', async (callback) => {
    try {
      const { tournamentId, user } = socket.data;

      if (!tournamentId) {
        throw new SocketDataNotDefinedError(
          'Tournament id in is not defined in your Socket!'
        );
      }

      if (!user) {
        throw new SocketDataNotDefinedError(
          'User in is not defined in your Socket!'
        );
      }

      // check if tournament exists
      const tournament = await prismaClient.tournament.findUnique({
        where: { id: tournamentId },
        select: { hostId: true, id: true, currentSize: true, status: true }
      });

      // if tournament does not exists throw an error
      if (!tournament) {
        throw new NotFoundError('Tournament was not found!');
      }

      // check if the tournament already started
      if (tournament.status !== 'WAITING_FOR_MORE_PLAYERS') {
        throw new GameError(
          'The tournament already started!',
          httpStatus.CONFLICT
        );
      }

      // check if the client that triggered the event is the host of the tournament
      // if not throw an error
      if (tournament.hostId !== user.id) {
        throw new PrivilegeError('Your not the host of this tournament!');
      }

      // check if their are minimal 2 players in the tournament
      if (tournament.currentSize < 2) {
        throw new InvalidParticipantsError(
          'To start the Tournament their must be a minimum of 2 Participants!'
        );
      }

      // update db state
      const updatedTournament = await prismaClient.tournament.update({
        where: { id: tournamentId },
        data: { status: 'IN_PROGRESS', startedAt: new Date() },
        select: {
          id: true,
          players: { select: { id: true, username: true } }
        }
      });

      callback({ success: true, data: null, error: null });

      const tInfo = await getTournamentInfo(tournamentId, 'Tournament started');

      socket
        .to(`tournament:${tournamentId}`)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-assertion
        .emit('tournament:info', tInfo!);

      // update available tournament list
      await updateAvailableTournaments();

      // * start matchmaking queue

      // create tournament statistics for all players
      for (const player of updatedTournament.players) {
        await prismaClient.tournamentStatistic.create({
          data: {
            player: { connect: { id: player.id } },
            tournament: { connect: { id: tournamentId } }
          }
        });
      }

      matchMakingQueues.set(
        tournamentId,
        new PriorityQueue(updatedTournament.players)
      );

      // eslint-disable-next-line @typescript-eslint/await-thenable
      await matchmaking(io, tournamentId);
    } catch (error) {
      logger.error(error);
      if (error instanceof Error) {
        callback({
          success: false,
          data: null,
          error: {
            message: error.message
          }
        });
      } else {
        callback({
          success: false,
          data: null,
          error: {
            message: 'An unknown error occurred'
          }
        });
      }
    }
  });

  socket.on('disconnecting', () => {
    logger.info(`${socket.id} is in disconnecting state`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client with socket id: ${socket.id} disconnected`);
  });
});

app.all('*', (_req, res) => {
  res.status(404).json({ error: '404 Not Found' });
});

app.use(errorHandler);

export default server;
