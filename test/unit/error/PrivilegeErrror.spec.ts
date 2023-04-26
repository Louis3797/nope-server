import PrivilegeError from '../../../src/error/PrivilegeError';

describe('PrivilegeError', () => {
  test('should create an instance of PrivilegeError with the correct message and status', () => {
    const errorMessage = 'This is a custom error message';
    const errorStatus = 403;
    const error = new PrivilegeError(errorMessage);

    expect(error).toBeInstanceOf(PrivilegeError);
    expect(error.message).toBe(errorMessage);
    expect(error.status).toBe(errorStatus);
  });

  test('should have the correct name', () => {
    const errorMessage = 'This is a custom error message';
    const error = new PrivilegeError(errorMessage);

    expect(error.name).toBe('PrivilegeError');
  });
});
