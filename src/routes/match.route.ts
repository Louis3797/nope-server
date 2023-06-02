import { Router } from 'express';
import { matchController } from '../controller';
import validate from '../middleware/validate';
import { matchInfoParamSchema } from '../validations/match.validation';

const matchRouter = Router();

matchRouter.get(
  '/:matchId',
  validate(matchInfoParamSchema),
  matchController.getMatchInfo
);

export default matchRouter;
