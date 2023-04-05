import * as dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';
import { type DeepReadonly } from 'utility-types';

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const envSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().port().required().default(4000),
  CORS_ORIGIN: Joi.string().required().default('*')
});

const { value: validatedEnv, error } = envSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env, { abortEarly: false, stripUnknown: true });

if (error) {
  throw new Error(
    `Environment variable validation error: \n${error.details
      .map((detail) => detail.message)
      .join('\n')}`
  );
}

const config: DeepReadonly<{
  node_env: 'production' | 'development' | 'test';
  app: {
    port: number;
  };
  cors: {
    origin: string;
  };
}> = {
  node_env: validatedEnv.NODE_ENV,
  app: {
    port: validatedEnv.PORT
  },
  cors: {
    origin: validatedEnv.CORS_ORIGIN
  }
};

export default config;
