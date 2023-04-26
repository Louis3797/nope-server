import GameError from '../../../src/error/GameError';

describe('GameError', () => {
  test('should create an instance of GameError with the correct message and status', () => {
    const errorMessage = 'This is a custom error message';
    const errorStatus = 404;
    const error = new GameError(errorMessage, errorStatus);

    expect(error).toBeInstanceOf(GameError);
    expect(error.message).toBe(errorMessage);
    expect(error.status).toBe(errorStatus);
  });

  test('should have the correct name', () => {
    const errorMessage = 'This is a custom error message';
    const errorStatus = 404;
    const error = new GameError(errorMessage, errorStatus);

    expect(error.name).toBe('GameError');
  });
});
