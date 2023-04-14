import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import validate from '../../../src/middleware/validate';

describe('validate middleware', () => {
  const req = {
    body: {
      name: 'John Doe',
      age: 30
    },
    query: {
      page: 1,
      limit: 10
    },
    params: {
      id: 1
    }
  } as unknown as Request;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  } as Partial<Response>;

  const next = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call next if validation succeeds', () => {
    const schema = {
      body: Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required()
      }),
      query: Joi.object({
        page: Joi.number().required(),
        limit: Joi.number().required()
      }),
      params: Joi.object({
        id: Joi.number().required()
      })
    };

    const middleware = validate(schema);

    middleware(req, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  test('should return 400 BAD REQUEST if validation fails', () => {
    const schema = {
      body: Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
        email: Joi.string().email().required()
      }),
      query: Joi.object({
        page: Joi.number().required(),
        limit: Joi.number().required(),
        sort: Joi.string().valid('asc', 'desc').optional()
      }),
      params: Joi.object({
        id: Joi.number().required()
      })
    };

    const middleware = validate(schema);

    middleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ field: 'body, email', message: '"body.email" is required' }]
    });
  });
});
