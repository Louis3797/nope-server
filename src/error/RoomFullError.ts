import GameError from './GameError';

export default class RoomFullError extends GameError {
  constructor(message: string) {
    super(message, 422);
  }
}
