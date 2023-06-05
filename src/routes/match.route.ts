import { Router } from 'express';
import { matchController } from '../controller';
import validate from '../middleware/validate';
import { matchInfoParamSchema } from '../validations/match.validation';

/**
 * @swagger
 * components:
 *   schemas:
 *     MatchInfo:
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
 *         winnerId:
 *           type: string
 *         winner:
 *           $ref: '#/components/schemas/BasicPlayer'
 *         opponents:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *                id:
 *                  type: string
 *                username:
 *                  type: string
 *         games:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *              id:
 *                type: string
 *              gameMode:
 *                type: string
 *              createdAt:
 *                type: string
 *              endedAt:
 *                type: string
 *              status:
 *                type: string
 *              roomSize:
 *                type: integer
 *              players:
 *                $ref: '#/components/schemas/BasicPlayer'
 *              private:
 *                type: boolean
 *              winner:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  username:
 *                    type: string
 */

/**
 * @swagger
 * tags:
 *   name: Match
 *   description: Match API
 */

const matchRouter = Router();

/**
 * @swagger
 * /api/match/{id}:
 *   get:
 *     summary: Get specific match per ID
 *     tags: [Match]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Match ID
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/MatchInfo'
 *       404:
 *         description: Match not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
matchRouter.get(
  '/:matchId',
  validate(matchInfoParamSchema),
  matchController.getMatchInfo
);

export default matchRouter;
