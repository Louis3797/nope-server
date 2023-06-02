import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import prismaClient from '../config/prisma';

export const getPlayerInfo = async (
  req: Request<{ name: string }>,
  res: Response
) => {
  const playerInfo = await prismaClient.player.findUnique({
    where: { username: req.params.name },
    select: {
      id: true,
      username: true,
      firstname: true,
      lastname: true,
      createdAt: true
      //   tournaments: true,
      //   won_tournament_matches: true,
      //   tournament_matches: true,
      //   tournamentStatistic: true,
      //   wonGames: true,
      //   wonTournaments: true,
      //   hostedTournaments: true
    }
  });

  // Player not found
  if (!playerInfo) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'Player not found' });
  }

  res.status(httpStatus.OK).json(playerInfo);
};

export const getParticipatedTournaments = async (
  req: Request<{ name: string }>,
  res: Response
) => {
  const playerTournaments = await prismaClient.player.findUnique({
    where: {
      username: req.params.name
    },
    select: {
      tournaments: {
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
          }
        }
      }
    }
  });

  if (!playerTournaments) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'Player not found' });
  }

  res.status(httpStatus.OK).json(playerTournaments);
};

export const getWonTournaments = async (
  req: Request<{ name: string }>,
  res: Response
) => {
  const wonTournaments = await prismaClient.player.findUnique({
    where: {
      username: req.params.name
    },
    select: {
      wonTournaments: {
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
          }
        }
      }
    }
  });

  if (!wonTournaments) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'Player not found' });
  }

  res.status(httpStatus.OK).json(wonTournaments);
};

export const getHostedTournaments = async (
  req: Request<{ name: string }>,
  res: Response
) => {
  const hostedTournaments = await prismaClient.player.findUnique({
    where: {
      username: req.params.name
    },
    select: {
      hostedTournaments: {
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
          }
        }
      }
    }
  });

  if (!hostedTournaments) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'Player not found' });
  }

  res.status(httpStatus.OK).json(hostedTournaments);
};

// export const getParticipatedMatches = async (
//   req: Request<{ name: string }>,
//   res: Response
// ) => {};

// export const getWonMatches = async (
//   req: Request<{ name: string }>,
//   res: Response
// ) => {};

// export const getParticipatedGames = async (
//   req: Request<{ name: string }>,
//   res: Response
// ) => {};

// export const getWonGames = async (
//   req: Request<{ name: string }>,
//   res: Response
// ) => {};

export const getAllTournamentStatistics = async (
  req: Request<{ name: string }>,
  res: Response
) => {
  const statistic = await prismaClient.player.findUnique({
    where: { username: req.params.name },
    select: {
      tournamentStatistic: {
        select: {
          tournamentId: true,
          matchesPlayed: true,
          wonMatches: true,
          lostMatches: true,
          gamesPlayed: true,
          wonGames: true,
          lostGames: true
        }
      }
    }
  });

  if (!statistic) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'Player not found' });
  }

  res.status(httpStatus.OK).json(statistic);
};

export const getStats = async (
  req: Request<{ name: string }>,
  res: Response
) => {
  const stats = await prismaClient.player.findUnique({
    where: { username: req.params.name },
    select: {
      tournamentStatistic: {
        select: {
          matchesPlayed: true,
          wonMatches: true,
          lostMatches: true,
          gamesPlayed: true,
          wonGames: true,
          lostGames: true
        }
      }
    }
  });

  if (!stats) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: 'Player not found' });
  }

  const resultStats = {
    stats: {
      matchesPlayed: 0,
      wonMatches: 0,
      lostMatches: 0,
      gamesPlayed: 0,
      wonGames: 0,
      lostGames: 0
    }
  };

  for (const stat of stats.tournamentStatistic) {
    resultStats.stats.matchesPlayed += stat.matchesPlayed;
    resultStats.stats.wonMatches += stat.wonMatches;
    resultStats.stats.lostMatches += stat.lostMatches;
    resultStats.stats.gamesPlayed += stat.gamesPlayed;
    resultStats.stats.wonGames += stat.wonGames;
    resultStats.stats.lostGames += stat.lostGames;
  }

  res.status(httpStatus.OK).json(resultStats);
};
