import { type Socket } from 'socket.io';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from '../../config/config';
import { type ExtendedError } from 'socket.io/dist/namespace';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const { verify } = jwt;

const isAuthSocket = (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  // get the JWT from the Socket.IO authentication header
  const token = socket.handshake.auth.token;

  // verify the JWT
  verify(
    token,
    config.jwt.access_token.secret,
    (err: Error, payload: JwtPayload) => {
      if (err) {
        next(new Error('Authentication error')); // invalid token
        return;
      }
      socket.data.user = payload;

      next();
    }
  );
};

export default isAuthSocket;
