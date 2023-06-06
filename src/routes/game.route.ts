import { Router } from 'express';
import { gameController } from '../controller';

import { gameInfoPramSchema } from '../validations/game.validation';
import validate from '../middleware/validate';

/**
 * @swagger
 * components:
 *   schemas:
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
 *         moveHistory:
 *           type: array
 *           items:
 *            type: object
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
 */

/**
 * @swagger
 * tags:
 *   name: Game
 *   description: Game API
 */

const gameRouter = Router();

/**
 * @swagger
 * /api/game/{id}:
 *   get:
 *     summary: Get specific game per ID
 *     tags: [Game]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Game ID
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Game'
 *       404:
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
gameRouter.get(
  '/:gameId',
  validate(gameInfoPramSchema),
  gameController.getGameInfo
);

export default gameRouter;
