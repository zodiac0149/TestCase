import { Router } from 'express';
import { param } from 'express-validator';
import * as controller from '../controllers/exportController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../validators/validateRequest.js';

export const exportRoutes = Router();
const projectParam = [param('projectId').isMongoId()];

exportRoutes.get('/markdown/:projectId', requireAuth, projectParam, validateRequest, controller.markdown);
exportRoutes.get('/pdf/:projectId', requireAuth, projectParam, validateRequest, controller.pdf);
exportRoutes.get('/json/:projectId', requireAuth, projectParam, validateRequest, controller.json);
