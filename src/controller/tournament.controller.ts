import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import prismaClient from '../config/prisma';

export const getTournamentInfo = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const tournament = await prismaClient.tournament.findUnique({
    where: {
      id: req.params.id
    },
    select: {
      id: true,
      createdAt: true,
      endedAt: true,
      startedAt: true,
      status: true,
      bestOf: true,
      host: {
        select: {
          id: true,
          username: true,
          firstname: true,
          lastname: true
        }
      },
      winner: {
        select: {
          id: true,
          username: true,
          firstname: true,
          lastname: true
        }
      },
      players: {
        select: {
          id: true,
          username: true,
          firstname: true,
          lastname: true
        }
      },
      matches: {
        include: {
          winner: {
            select: {
              id: true,
              username: true,
              firstname: true,
              lastname: true
            }
          },
          opponents: {
            select: {
              id: true,
              username: true,
              firstname: true,
              lastname: true
            }
          }
        }
      }
    }
  });

  if (!tournament) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'Tournament not found' });
  }

  res.status(httpStatus.OK).json(tournament);
};

export const getTournamentStatistic = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const statistic = await prismaClient.tournamentStatistic.findMany({
    where: { tournamentId: req.params.id },
    select: {
      player: {
        select: {
          id: true,
          username: true,
          firstname: true,
          lastname: true
        }
      },
      tournamentId: true,
      matchesPlayed: true,
      wonMatches: true,
      lostMatches: true,
      gamesPlayed: true,
      wonGames: true,
      lostGames: true
    }
  });

  if (!statistic) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'Tournament not found' });
  }

  res.status(httpStatus.OK).json(statistic);
};
