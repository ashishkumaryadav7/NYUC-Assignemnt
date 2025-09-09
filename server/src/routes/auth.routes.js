import { Router } from 'express';
import { login, logout, refresh, signup } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, signupSchema } from '../validators/auth.validators.js';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
