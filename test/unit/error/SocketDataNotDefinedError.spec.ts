import SocketDataNotDefinedError from '../../../src/error/SocketDataNotDefinedError';

describe('SocketDataNotDefinedError', () => {
  test('should create an instance of SocketDataNotDefinedError with the correct message and status', () => {
    const errorMessage = 'This is a custom error message';
    const errorStatus = 400;
    const error = new SocketDataNotDefinedError(errorMessage);

    expect(error).toBeInstanceOf(SocketDataNotDefinedError);
    expect(error.message).toBe(errorMessage);
    expect(error.status).toBe(errorStatus);
  });

  test('should have the correct name', () => {
    const errorMessage = 'This is a custom error message';
    const error = new SocketDataNotDefinedError(errorMessage);

    expect(error.name).toBe('SocketDataNotDefinedError');
  });
});
