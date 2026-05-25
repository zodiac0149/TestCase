import { body, param } from 'express-validator';

export const createProjectRules = [
  body('projectName').trim().isLength({ min: 2 }).withMessage('Project name is required'),
  body('repositoryUrl').optional({ checkFalsy: true }).isURL().withMessage('Repository URL must be valid'),
];

export const projectIdRules = [param('id').isMongoId().withMessage('Invalid project id')];
