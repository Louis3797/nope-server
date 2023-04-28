import prismaClient from '../config/prisma';
import type { TournamentInfoPayload } from '../types/socket';

export const getTournamentInfo = async (
  id: string,
  message?: string
): Promise<TournamentInfoPayload | null> => {
  const tournament = await prismaClient.tournament.findUnique({
    where: { id },
    select: {
      id: true,
      currentSize: true,
      players: { select: { id: true, username: true } },
      tournamentStatistic: {
        select: { playerId: true, wonMatches: true }
      },
      winnerId: true,
      host: { select: { id: true, username: true } },
      status: true
    }
  });

  if (!tournament) {
    return null;
  }

  // calculate score of each player
  const playerData: Array<{
    id: string;
    username: string;
    score: number;
  }> = tournament.players.map((player) => ({
    id: player.id,
    username: player.username,
    score:
      (
        tournament.tournamentStatistic.find(
          (stat) => stat.playerId === player.id
        ) ?? {}
      ).wonMatches ?? 0
  }));

  // get winner
  const winner = playerData.find((p) => p.id === tournament.winnerId);

  const tournamentInfo: TournamentInfoPayload = {
    message: message ?? '',
    tournamentId: tournament.id,
    currentSize: tournament.currentSize,
    status: tournament.status,
    players: playerData,
    winner: winner ?? null,
    host: tournament.host
  };

  return tournamentInfo;
};
