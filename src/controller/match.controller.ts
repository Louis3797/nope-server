import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import prismaClient from '../config/prisma';

export const getMatchInfo = async (
  req: Request<{ matchId: string }>,
  res: Response
) => {
  const matchInfo = await prismaClient.match.findUnique({
    where: { id: req.params.matchId },
    include: {
      opponents: {
        select: {
          id: true,
          username: true
        }
      },
      games: {
        select: {
          id: true,
          gameMode: true,
          createdAt: true,
          endedAt: true,
          status: true,
          roomSize: true,
          players: {
            select: {
              id: true,
              username: true,
              firstname: true,
              lastname: true
            }
          },
          private: true,
          winner: {
            select: {
              id: true,
              username: true
            }
          }
        }
      },
      winner: {
        select: {
          id: true,
          username: true,
          firstname: true,
          lastname: true
        }
      }
    }
  });

  if (!matchInfo) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'Match not found' });
  }

  res.status(httpStatus.OK).json(matchInfo);
};
