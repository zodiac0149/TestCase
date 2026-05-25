import { Router } from 'express';
import * as controller from '../controllers/chatController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { chatRules } from '../validators/chatValidators.js';
import { validateRequest } from '../validators/validateRequest.js';

export const chatRoutes = Router();

chatRoutes.post('/', requireAuth, chatRules, validateRequest, controller.chat);
