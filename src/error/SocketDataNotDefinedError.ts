import httpStatus from 'http-status';
import GameError from './GameError';

export default class SocketDataNotDefinedError extends GameError {
  constructor(message: string) {
    super(message, httpStatus.BAD_REQUEST);
  }
}
