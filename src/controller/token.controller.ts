import config from '../config/config';
import { type Response } from 'express';
import httpStatus from 'http-status';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { TypedRequest, VerifyTokenCredentials } from 'src/types/types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const { verify } = jwt;

export const handleVerifyToken = async (
  req: TypedRequest<VerifyTokenCredentials>,
  res: Response
) => {
  const { token } = req.body;
  if (!token) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: 'Token is required!'
    });
  }

  verify(
    token,
    config.jwt.access_token.secret,
    (err: unknown, payload: JwtPayload) => {
      if (err) return res.sendStatus(httpStatus.FORBIDDEN); // invalid token

      return res
        .status(httpStatus.OK)
        .json({ user: { id: payload.userId, username: payload.username } });
    }
  );
};
