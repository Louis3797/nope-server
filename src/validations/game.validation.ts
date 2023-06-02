import Joi from 'joi';

export const gameInfoPramSchema = {
  params: Joi.object().keys({
    gameId: Joi.string().required()
  })
};
