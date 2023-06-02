import Joi from 'joi';
import type { PlayerInfoParams } from '../types/types';

export const playerInfoSchema = {
  params: Joi.object<PlayerInfoParams>().keys({
    name: Joi.string().required().min(2)
  })
};
