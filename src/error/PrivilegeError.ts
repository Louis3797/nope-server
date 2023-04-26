import httpStatus from 'http-status';
import GameError from './GameError';

export default class PrivilegeError extends GameError {
  constructor(message: string) {
    super(message, httpStatus.FORBIDDEN);
  }
}
