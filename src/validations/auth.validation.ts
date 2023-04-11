import Joi from 'joi';
import type {
  UserLoginCredentials,
  UserRegisterCredentials
} from '../types/types';

export const registerSchema = {
  body: Joi.object<UserRegisterCredentials>().keys({
    password: Joi.string().required().min(6),
    username: Joi.string().required().min(2),
    firstname: Joi.string().required().min(2),
    lastname: Joi.string().required().min(2)
  })
};

export const loginSchema = {
  body: Joi.object<UserLoginCredentials>().keys({
    username: Joi.string().required().min(2),
    password: Joi.string().required().min(6)
  })
};
