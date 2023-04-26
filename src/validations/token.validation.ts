import Joi from 'joi';
import { type VerifyTokenCredentials } from '../types/types';

export const verifyTokenSchema = {
  body: Joi.object<VerifyTokenCredentials>().keys({
    token: Joi.string().required()
  })
};
