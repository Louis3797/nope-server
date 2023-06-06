import { Router } from 'express';
import { tournamentController } from '../controller';
import validate from '../middleware/validate';
import { tournamentInfoSchema } from '../validations/tournament.validation';

/**
 * @swagger
 * components:
 *   schemas:
 *     TournamentStatistic:
 *       type: object
 *       properties:
 *         player:
 *             $ref: '#/components/schemas/BasicPlayer'
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
 *     StatisticList:
 *       type: object
 *       properties:
 *        tournamentStatistic:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/TournamentStatistic'
 */

/**
 * @swagger
 * tags:
 *   name: Tournament
 *   description: Tournament API
 */

const tournamentRouter = Router();

/**
 * @swagger
 * /api/tournament/{id}:
 *   get:
 *     summary: Get specific tournament per ID
 *     tags: [Tournament]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tournament ID
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Tournament'
 *       404:
 *         description: Tournament not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
tournamentRouter.get(
  '/:id',
  validate(tournamentInfoSchema),
  tournamentController.getTournamentInfo
);

/**
 * @swagger
 * /api/tournament/{id}/statistic:
 *   get:
 *     summary: Get statistics of all players that are part of the tournament
 *     tags: [Tournament]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tournament ID
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/StatisticList'
 *       404:
 *         description: Tournament not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
tournamentRouter.get(
  '/:id/statistic',
  validate(tournamentInfoSchema),
  tournamentController.getTournamentStatistic
);

export default tournamentRouter;
