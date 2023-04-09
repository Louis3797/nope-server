import GameError from './GameError';

export default class GameNotFoundError extends GameError {
  constructor(message: string) {
    super(message, 404);
  }
}
