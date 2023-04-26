import GameError from './GameError';

export default class NotFoundError extends GameError {
  constructor(message: string) {
    super(message, 404);
  }
}
