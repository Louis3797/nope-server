import NotFoundError from '../../../src/error/NotFoundError';

describe('NotFoundError', () => {
  test('should create an instance of NotFoundError with the correct message and status', () => {
    const errorMessage = 'This is a custom error message';
    const errorStatus = 404;
    const error = new NotFoundError(errorMessage);

    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.message).toBe(errorMessage);
    expect(error.status).toBe(errorStatus);
  });

  test('should have the correct name', () => {
    const errorMessage = 'This is a custom error message';
    const error = new NotFoundError(errorMessage);

    expect(error.name).toBe('NotFoundError');
  });
});
