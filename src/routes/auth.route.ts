import { Router } from 'express';
import validate from '../middleware/validate';
import { loginSchema, registerSchema } from '../validations/auth.validation';
import { authController } from '../controller/';

const authRouter = Router();

authRouter.post(
  '/register',
  validate(registerSchema),
  authController.handleRegister
);

authRouter.post('/login', validate(loginSchema), authController.handleLogin);

export default authRouter;
