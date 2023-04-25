import type { Response } from 'express';
import httpStatus from 'http-status';
import * as argon2 from 'argon2';
import type {
  TypedRequest,
  UserLoginCredentials,
  UserRegisterCredentials
} from '../types/types';
import config from '../config/config';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { createPlayer, getPlayerByName } from '../service/player.service';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const { sign } = jwt;

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

  const checkUsername = await getPlayerByName(username);

  if (checkUsername) return res.sendStatus(httpStatus.CONFLICT); // username is already in db

  try {
    const hashedPassword = await argon2.hash(password);

    await createPlayer(username, firstname, lastname, hashedPassword);

    res.status(httpStatus.CREATED).json({ message: 'New player created' });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
};

export const handleLogin = async (
  req: TypedRequest<UserLoginCredentials>,
  res: Response
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Username and password are required!' });
  }

  const user = await getPlayerByName(username, {
    id: true,
    username: true,
    firstname: true,
    lastname: true,
    password: true,
    gamesWon: true,
    gamesPlayed: true
  });

  if (!user) return res.sendStatus(httpStatus.UNAUTHORIZED);

  // check password
  try {
    if (await argon2.verify(user.password, password)) {
      const accessToken = sign(
        { username: user.username, userId: user.id } as JwtPayload,
        config.jwt.access_token.secret,
        {
          expiresIn: config.jwt.access_token.expiresIn
        }
      );

      // send access token per json to user so it can be stored in the localStorage
      const { password: userPassword, ...userData } = user;
      return res.json({ accessToken, user: userData });
    } else {
      return res.status(httpStatus.UNAUTHORIZED);
    }
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
};
