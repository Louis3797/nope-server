import { rateLimit } from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message:
    'Too many authentication attempts made from this IP, please try again in 15 minutes',
  skipSuccessfulRequests: true
});

export default authLimiter;
