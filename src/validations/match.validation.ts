import Joi from 'joi';

export const matchInfoParamSchema = {
  params: Joi.object().keys({
    matchId: Joi.string().required()
  })
};
