import InvalidParticipantsError from '../../../src/error/InvalidParticipantsError';

describe('InvalidParticipantsError', () => {
  test('should create an instance of InvalidParticipantsError with the correct message and status', () => {
    const errorMessage = 'This is a custom error message';
    const errorStatus = 409;
    const error = new InvalidParticipantsError(errorMessage);

    expect(error).toBeInstanceOf(InvalidParticipantsError);
    expect(error.message).toBe(errorMessage);
    expect(error.status).toBe(errorStatus);
  });

  test('should have the correct name', () => {
    const errorMessage = 'This is a custom error message';
    const error = new InvalidParticipantsError(errorMessage);

    expect(error.name).toBe('InvalidParticipantsError');
  });
});
