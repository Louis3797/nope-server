import PlayerNotFoundError from '../../../src/error/PlayerNotFoundError';

describe('PlayerNotFoundError', () => {
  test('should create an instance of PlayerNotFoundError with the correct message and status', () => {
    const errorMessage = 'This is a custom error message';
    const errorStatus = 404;
    const error = new PlayerNotFoundError(errorMessage);

    expect(error).toBeInstanceOf(PlayerNotFoundError);
    expect(error.message).toBe(errorMessage);
    expect(error.status).toBe(errorStatus);
  });

  test('should have the correct name', () => {
    const errorMessage = 'This is a custom error message';
    const error = new PlayerNotFoundError(errorMessage);

    expect(error.name).toBe('PlayerNotFoundError');
  });
});
