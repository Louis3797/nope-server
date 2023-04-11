import type { Response } from 'express';
import httpStatus from 'http-status';
import * as argon2 from 'argon2';
import prismaClient from '../config/prisma';
import type {
  TypedRequest,
  UserLoginCredentials,
  UserRegisterCredentials
} from '../types/types';

export const handleRegister = async (
  req: TypedRequest<UserRegisterCredentials>,
  res: Response
) => {
  const { username, firstname, lastname, password } = req.body;

  if (!username || !password || !firstname || !lastname) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Username, firstname, lastname and password are required!'
    });
  }

  const checkUsername = await prismaClient.player.findUnique({
    where: {
      username
    }
  });

  if (checkUsername) return res.sendStatus(httpStatus.CONFLICT); // username is already in db

  try {
    const hashedPassword = await argon2.hash(password);

    await prismaClient.player.create({
      data: {
        username,
        firstname,
        lastname,
        password: hashedPassword
      }
    });

    res.status(httpStatus.CREATED).json({ message: 'New user created' });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const handleLogin = async (
  _req: TypedRequest<UserLoginCredentials>,
  res: Response
) => {
  res.sendStatus(httpStatus.OK);
};

export const handleLogout = async (_req: TypedRequest, res: Response) => {
  res.sendStatus(httpStatus.OK);
};
