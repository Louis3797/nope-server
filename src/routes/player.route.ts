import { Router } from 'express';

import { playerController } from '../controller';
import validate from '../middleware/validate';
import { playerInfoSchema } from '../validations/player.validation';

/**
 * @swagger
 * components:
 *   schemas:
 *     Player:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         createdAt:
 *           type: string
 *       required:
 *         - id
 *         - username
 *         - firstname
 *         - lastname
 *         - createdAt
 *     BasicPlayer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *       required:
 *         - id
 *         - username
 *         - firstname
 *         - lastname
 *     Tournament:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         createdAt:
 *           type: string
 *         endedAt:
 *           type: string
 *         startedAt:
 *           type: string
 *         status:
 *           type: string
 *         bestOf:
 *           type: integer
 *         host:
 *           $ref: '#/components/schemas/BasicPlayer'
 *         winner:
 *           $ref: '#/components/schemas/BasicPlayer'
 *         players:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BasicPlayer'
 *       required:
 *         - id
 *         - createdAt
 *         - endedAt
 *         - startedAt
 *         - status
 *         - bestOf
 *         - host
 *         - winner
 *         - players
 *     Match:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         createdAt:
 *           type: string
 *         round:
 *           type: integer
 *         tournamentId:
 *           type: string
 *         status:
 *           type: string
 *         winner:
 *           $ref: '#/components/schemas/BasicPlayer'
 *         opponents:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BasicPlayer'
 *       required:
 *         - id
 *         - createdAt
 *         - round
 *         - tournamentId
 *         - status
 *         - winner
 *         - opponents
 *     Game:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         gameMode:
 *           type: string
 *         createdAt:
 *           type: string
 *         endedAt:
 *           type: string
 *         status:
 *           type: string
 *         roomSize:
 *           type: integer
 *         private:
 *           type: boolean
 *         players:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BasicPlayer'
 *         matchId:
 *           type: string
 *         winner:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             username:
 *               type: string
 *           required:
 *             - id
 *             - username
 *       required:
 *         - id
 *         - gameMode
 *         - createdAt
 *         - endedAt
 *         - status
 *         - roomSize
 *         - private
 *         - players
 *         - matchId
 *         - winner
 *     TournamentStatistic:
 *       type: object
 *       properties:
 *         tournamentId:
 *           type: string
 *         matchesPlayed:
 *           type: integer
 *         wonMatches:
 *           type: integer
 *         lostMatches:
 *           type: integer
 *         gamesPlayed:
 *           type: integer
 *         wonGames:
 *           type: integer
 *         lostGames:
 *           type: integer
 *     ErrorResponse:
 *        type: object
 *        properties:
 *          message:
 *            type: string
 *     PlayerStats:
 *        type: object
 *        properties:
 *          matchesPlayed:
 *            type: integer
 *          wonMatches:
 *            type: integer
 *          lostMatches:
 *            type: integer
 *          gamesPlayed:
 *            type: integer
 *          wonGames:
 *            type: integer
 *          lostGames:
 *            type: integer
 *     ParticipatedTournamentList:
 *        type: object
 *        properties:
 *          tournaments:
 *            type: array
 *            items:
 *             $ref: '#/components/schemas/Tournament'
 *     WonTournamentList:
 *        type: object
 *        properties:
 *          wonTournaments:
 *            type: array
 *            items:
 *             $ref: '#/components/schemas/Tournament'
 *     HostedTournamentList:
 *        type: object
 *        properties:
 *          hostedTournaments:
 *            type: array
 *            items:
 *             $ref: '#/components/schemas/Tournament'
 *     TournamentStatisticList:
 *        type: object
 *        properties:
 *          tournamentStatistic:
 *            type: array
 *            items:
 *             $ref: '#/components/schemas/TournamentStatistic'
 *     MatchList:
 *        type: object
 *        properties:
 *          tournament_matches:
 *            type: array
 *            items:
 *             $ref: '#/components/schemas/Match'
 *     WonMatchList:
 *        type: object
 *        properties:
 *          won_tournament_matches:
 *            type: array
 *            items:
 *             $ref: '#/components/schemas/Match'
 *     GameList:
 *        type: object
 *        properties:
 *          playedGames:
 *            type: array
 *            items:
 *             $ref: '#/components/schemas/Game'
 *     WonGameList:
 *        type: object
 *        properties:
 *          wonGames:
 *            type: array
 *            items:
 *             $ref: '#/components/schemas/Game'
 */

/**
 * @swagger
 * tags:
 *   name: Player
 *   description: Player information and statistics
 */

const playerRouter = Router();

/**
 * @swagger
 * /api/player/{name}:
 *   get:
 *     summary: Get player information
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Player username
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Player'
 *       404:
 *         description: Player not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playerRouter.get(
  '/:name',
  validate(playerInfoSchema),
  playerController.getPlayerInfo
);

/**
 * @swagger
 * /api/player/{name}/stats:
 *   get:
 *     summary: Get player stats
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Player username
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlayerStats'
 *       404:
 *         description: Player not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playerRouter.get('/:name/stats', playerController.getStats);

/**
 * @swagger
 * /api/player/{name}/tournaments:
 *   get:
 *     summary: Get participated tournaments of player
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Player username
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/ParticipatedTournamentList'
 *       404:
 *         description: Player not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playerRouter.get(
  '/:name/tournaments',
  playerController.getParticipatedTournaments
);

/**
 * @swagger
 * /api/player/{name}/tournaments/won:
 *   get:
 *     summary: Get won tournaments of player
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Player username
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/WonTournamentList'
 *       404:
 *         description: Player not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playerRouter.get('/:name/tournaments/won', playerController.getWonTournaments);

/**
 * @swagger
 * /api/player/{name}/tournaments/hosted:
 *   get:
 *     summary: Get hosted tournaments of player
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Player username
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/HostedTournamentList'
 *       404:
 *         description: Player not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playerRouter.get(
  '/:name/tournaments/hosted',
  playerController.getHostedTournaments
);

/**
 * @swagger
 * /api/player/{name}/tournaments/statistics:
 *   get:
 *     summary: Get all statistics of a specific tournament
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Player username
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/TournamentStatisticList'
 *       404:
 *         description: Player not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playerRouter.get(
  '/:name/tournaments/statistics',
  playerController.getAllTournamentStatistics
);

/**
 * @swagger
 * /api/player/{name}/matches:
 *   get:
 *     summary: Get participated matches of a player
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Player username
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/MatchList'
 *       404:
 *         description: Player not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playerRouter.get('/:name/matches', playerController.getParticipatedMatches);

/**
 * @swagger
 * /api/player/{name}/matches/won:
 *   get:
 *     summary: Get won matches of a player
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Player username
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/WonMatchList'
 *       404:
 *         description: Player not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playerRouter.get('/:name/matches/won', playerController.getWonMatches);

/**
 * @swagger
 * /api/player/{name}/games:
 *   get:
 *     summary: Get played games of a player
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Player username
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/GameList'
 *       404:
 *         description: Player not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playerRouter.get('/:name/games', playerController.getParticipatedGames);

/**
 * @swagger
 * /api/player/{name}/games/won:
 *   get:
 *     summary: Get won games of a player
 *     tags: [Player]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Player username
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/WonGameList'
 *       404:
 *         description: Player not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playerRouter.get('/:name/games/won', playerController.getWonGames);

export default playerRouter;
