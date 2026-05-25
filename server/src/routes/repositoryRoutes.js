import { Router } from 'express';
import { body } from 'express-validator';
import * as controller from '../controllers/repositoryController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { uploadZip, uploadSpec } from '../middlewares/uploadMiddleware.js';
import { validateRequest } from '../validators/validateRequest.js';

export const repositoryRoutes = Router();

repositoryRoutes.use(requireAuth);
repositoryRoutes.post('/upload', uploadZip.single('repository'), body('projectId').isMongoId(), validateRequest, controller.uploadRepository);
repositoryRoutes.post('/github', body('projectId').isMongoId(), body('repositoryUrl').isURL(), validateRequest, controller.importGithub);
repositoryRoutes.post('/specification', uploadSpec.single('specification'), body('projectId').isMongoId(), validateRequest, controller.uploadSpecification);
