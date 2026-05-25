import { Router } from 'express';
import * as controller from '../controllers/projectController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { createProjectRules, projectIdRules } from '../validators/projectValidators.js';
import { validateRequest } from '../validators/validateRequest.js';

export const projectRoutes = Router();

projectRoutes.use(requireAuth);
projectRoutes.post('/', createProjectRules, validateRequest, controller.createProject);
projectRoutes.get('/', controller.listProjects);
projectRoutes.get('/:id', projectIdRules, validateRequest, controller.getProject);
