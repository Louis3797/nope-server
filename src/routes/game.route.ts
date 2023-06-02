import { Router } from 'express';
import { gameController } from '../controller';

import { gameInfoPramSchema } from '../validations/game.validation';
import validate from '../middleware/validate';

const gameRouter = Router();

gameRouter.get(
  '/:gameId',
  validate(gameInfoPramSchema),
  gameController.getGameInfo
);

export default gameRouter;
