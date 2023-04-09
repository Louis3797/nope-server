import GameError from './GameError';

export default class PlayerNotFoundError extends GameError {
  constructor(message: string) {
    super(message, 404);
  }
}
