import { Router } from 'express';
import * as controller from '../controllers/authController.js';
import { signupRules, loginRules } from '../validators/authValidators.js';
import { validateRequest } from '../validators/validateRequest.js';

export const authRoutes = Router();

authRoutes.post('/signup', signupRules, validateRequest, controller.signup);
authRoutes.post('/login', loginRules, validateRequest, controller.login);
