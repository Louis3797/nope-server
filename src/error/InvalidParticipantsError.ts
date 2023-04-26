import httpStatus from 'http-status';
import GameError from './GameError';

export default class InvalidParticipantsError extends GameError {
  constructor(message: string) {
    super(message, httpStatus.CONFLICT);
  }
}
