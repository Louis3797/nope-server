import GameNotFoundError from '../../../src/error/GameNotFoundError';

describe('GameNotFoundError', () => {
  test('should create an instance of GameNotFoundError with the correct message and status', () => {
    const errorMessage = 'This is a custom error message';
    const errorStatus = 404;
    const error = new GameNotFoundError(errorMessage);

    expect(error).toBeInstanceOf(GameNotFoundError);
    expect(error.message).toBe(errorMessage);
    expect(error.status).toBe(errorStatus);
  });

  test('should have the correct name', () => {
    const errorMessage = 'This is a custom error message';
    const error = new GameNotFoundError(errorMessage);

    expect(error.name).toBe('GameNotFoundError');
  });
});
