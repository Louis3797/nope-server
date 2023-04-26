import type { Request, Response } from 'express';
import logger from '../../../src/middleware/logger';
import { errorHandler } from '../../../src/middleware/errorHandler';

jest.mock('../../../src/middleware/logger', () => ({
  error: jest.fn()
}));

describe('errorHandler', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('should log the error', () => {
    const error = new Error('Test error');

    errorHandler(error, req as Request, res as Response);

    expect(logger.error).toHaveBeenCalledWith(error);
  });

  test('should set the status to 500 and send an error message', () => {
    const error = new Error('Test error');

    errorHandler(error, req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Test error' });
  });
});
