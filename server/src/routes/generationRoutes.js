import { Router } from 'express';
import * as controller from '../controllers/generationController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { generateRules, regenerateRules } from '../validators/generationValidators.js';
import { validateRequest } from '../validators/validateRequest.js';

export const generationRoutes = Router();

generationRoutes.use(requireAuth);
generationRoutes.post('/tests', generateRules, validateRequest, controller.generateTests);
generationRoutes.post('/regenerate', regenerateRules, validateRequest, controller.regenerateTests);
