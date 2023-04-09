import GameError from './GameError';

export default class InvalidRoomSizeError extends GameError {
  constructor(message: string) {
    super(message, 422);
  }
}
