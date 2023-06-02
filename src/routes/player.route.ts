import { Router } from 'express';

import { playerController } from '../controller';
import validate from '../middleware/validate';
import { playerInfoSchema } from '../validations/player.validation';

const playerRouter = Router();

playerRouter.get(
  '/:name',
  validate(playerInfoSchema),
  playerController.getPlayerInfo
);

playerRouter.get('/:name/stats/', playerController.getStats);

playerRouter.get(
  '/:name/tournaments',
  playerController.getParticipatedTournaments
);

playerRouter.get('/:name/tournaments/won', playerController.getWonTournaments);

playerRouter.get(
  '/:name/tournaments/hosted',
  playerController.getHostedTournaments
);

playerRouter.get(
  '/:name/tournaments/statistics',
  playerController.getAllTournamentStatistics
);

playerRouter.get('/:name/matches', playerController.getParticipatedMatches);

playerRouter.get('/:name/matches/won', playerController.getWonMatches);

playerRouter.get('/:name/games', playerController.getParticipatedGames);

playerRouter.get('/:name/games/won', playerController.getWonGames);

export default playerRouter;
