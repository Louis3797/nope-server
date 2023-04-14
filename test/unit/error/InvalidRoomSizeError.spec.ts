import InvalidRoomSizeError from '../../../src/error/InvalidRoomSizeError';

describe('InvalidRoomSizeError', () => {
  test('should create an instance of GameNotFoundError with the correct message and status', () => {
    const errorMessage = 'This is a custom error message';
    const errorStatus = 422;
    const error = new InvalidRoomSizeError(errorMessage);

    expect(error).toBeInstanceOf(InvalidRoomSizeError);
    expect(error.message).toBe(errorMessage);
    expect(error.status).toBe(errorStatus);
  });

  test('should have the correct name', () => {
    const errorMessage = 'This is a custom error message';
    const error = new InvalidRoomSizeError(errorMessage);

    expect(error.name).toBe('InvalidRoomSizeError');
  });
});
