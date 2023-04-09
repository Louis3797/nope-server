import type { Player } from '@prisma/client';
import prismaClient from '../config/prisma';

export const getPlayerByID = async <K extends keyof Player>(
  id: string,
  select?: Record<K, boolean>
): Promise<Pick<Player, K> | null> => {
  const player = await prismaClient.player.findUnique({
    where: { id },
    select: select ?? null
  });

  return player as Pick<Player, K> | null;
};
