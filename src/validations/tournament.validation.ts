import Joi from 'joi';

export const tournamentInfoSchema = {
  params: Joi.object().keys({
    id: Joi.string().required()
  })
};
