import { Router } from 'express';
import validate from '../middleware/validate';
import { loginSchema, registerSchema } from '../validations/auth.validation';
import { authController } from '../controller';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLoginCredentials:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *     UserRegisterCredentials:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         password:
 *           type: string
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *     LoginResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         user:
 *          type: object
 *          properties:
 *            id:
 *              type: string
 *            username:
 *              type: string
 *            firstname:
 *              type: string
 *            lastname:
 *              type: string
 *
 * /api/auth/register:
 *   post:
 *     summary: Register a new player
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegisterCredentials'
 *     responses:
 *       '201':
 *         description: New player created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       '400':
 *         description: Bad Request - Username, firstname, lastname, and password are required
 *       '409':
 *         description: Conflict - Username already exists
 *       '500':
 *         description: Internal Server Error
 *
 * /api/auth/login:
 *   post:
 *     summary: Login with username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginCredentials'
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       '400':
 *         description: Bad Request - Username and password are required
 *       '401':
 *         description: Unauthorized - Invalid username or password
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 */

const authRouter = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new player
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegisterCredentials'
 *     responses:
 *       '201':
 *         description: New player created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       '400':
 *         description: Bad Request - Username, firstname, lastname, and password are required
 *       '409':
 *         description: Conflict - Username already exists
 *       '500':
 *         description: Internal Server Error
 */
authRouter.post(
  '/register',
  validate(registerSchema),
  authController.handleRegister
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginCredentials'
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       '400':
 *         description: Bad Request - Username and password are required
 *       '401':
 *         description: Unauthorized - Invalid username or password
 *       '500':
 *         description: Internal Server Error
 */
authRouter.post('/login', validate(loginSchema), authController.handleLogin);

export default authRouter;
