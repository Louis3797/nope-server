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

export const getPlayerByName = async <K extends keyof Player>(
  name: string,
  select?: Record<K, boolean>
): Promise<Pick<Player, K> | null> => {
  const player = await prismaClient.player.findUnique({
    where: { username: name },
    select: select ?? null
  });

  return player as Pick<Player, K> | null;
};

export const createPlayer = async (
  username: string,
  firstname: string,
  lastname: string,
  password: string
): Promise<Player> => {
  return await prismaClient.player.create({
    data: {
      username,
      firstname,
      lastname,
      password
    }
  });
};

export const deletePlayer = async (id: string): Promise<Player> => {
  return await prismaClient.player.delete({
    where: { id }
  });
};
