import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import prismaClient from '../config/prisma';

export const getGameInfo = async (
  req: Request<{ gameId: string }>,
  res: Response
) => {
  const gameInfo = await prismaClient.game.findUnique({
    where: { id: req.params.gameId },

    select: {
      id: true,
      gameMode: true,
      createdAt: true,
      endedAt: true,
      status: true,
      roomSize: true,
      private: true,
      players: {
        select: {
          id: true,
          username: true,
          firstname: true,
          lastname: true
        }
      },
      matchId: true,
      moveHistory: true,
      winner: {
        select: {
          id: true,
          username: true
        }
      }
    }
  });

  if (!gameInfo) {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'Game not found' });
  }

  res.status(httpStatus.OK).json(gameInfo);
};
