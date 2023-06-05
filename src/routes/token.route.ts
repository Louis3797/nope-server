import { Router } from 'express';
import validate from '../middleware/validate';
import { verifyTokenSchema } from '../validations/token.validation';
import { tokenController } from '../controller';

/**
 * @swagger
 * components:
 *   schemas:
 *     VerifyTokenCredentials:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *     User:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             username:
 *               type: string
 *
 * /api/verify-token:
 *   post:
 *     summary: Verify a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyTokenCredentials'
 *     responses:
 *       '200':
 *         description: Token verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad Request - Token is required
 *       '403':
 *         description: Forbidden - Invalid token
 */

// Import statements...

/**
 * @swagger
 * tags:
 *   name: Token
 *   description: Token Verification API
 */

const tokenRouter = Router();

/**
 * @swagger
 * /api/verify-token:
 *   post:
 *     tags: [Token]
 *     summary: Verify a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyTokenCredentials'
 *     responses:
 *       '200':
 *         description: Token verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad Request - Token is required
 *       '403':
 *         description: Forbidden - Invalid token
 */
tokenRouter.post(
  '/verify-token',
  validate(verifyTokenSchema),
  tokenController.handleVerifyToken
);

export default tokenRouter;
