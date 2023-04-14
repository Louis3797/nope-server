import { Router } from 'express';
import validate from '../middleware/validate';
import { verifyTokenSchema } from '../validations/token.validation';
import { tokenController } from '../controller';

const tokenRouter = Router();

tokenRouter.post(
  '/verify-token',
  validate(verifyTokenSchema),
  tokenController.handleVerifyToken
);

export default tokenRouter;
