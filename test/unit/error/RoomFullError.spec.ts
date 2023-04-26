import RoomFullError from '../../../src/error/RoomFullError';

describe('RoomFullError', () => {
  test('should create an instance of RoomFullError with the correct message and status', () => {
    const errorMessage = 'This is a custom error message';
    const errorStatus = 422;
    const error = new RoomFullError(errorMessage);

    expect(error).toBeInstanceOf(RoomFullError);
    expect(error.message).toBe(errorMessage);
    expect(error.status).toBe(errorStatus);
  });

  test('should have the correct name', () => {
    const errorMessage = 'This is a custom error message';
    const error = new RoomFullError(errorMessage);

    expect(error.name).toBe('RoomFullError');
  });
});
