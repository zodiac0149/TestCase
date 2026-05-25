import { body } from 'express-validator';

export const generateRules = [
  body('projectId').isMongoId().withMessage('Valid projectId is required'),
  body('testingGoal').trim().isLength({ min: 5 }).withMessage('Testing goal is required'),
  body('generationType').optional().isString(),
  body('codeSnippet').optional().isString(),
  body('instructions').optional().isString(),
];

export const regenerateRules = [
  body('generationId').isMongoId().withMessage('Valid generationId is required'),
  body('feedback').optional().isObject(),
];
