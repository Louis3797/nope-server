import { Router } from 'express';
import { tournamentController } from '../controller';
import validate from '../middleware/validate';
import { tournamentInfoSchema } from '../validations/tournament.validation';

const tournamentRouter = Router();

tournamentRouter.get(
  '/:id',
  validate(tournamentInfoSchema),
  tournamentController.getTournamentInfo
);

tournamentRouter.get(
  '/:id/statistic',
  validate(tournamentInfoSchema),
  tournamentController.getTournamentStatistic
);

export default tournamentRouter;
