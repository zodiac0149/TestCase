import { body } from 'express-validator';

export const chatRules = [
  body('projectId').isMongoId().withMessage('Valid projectId is required'),
  body('message').trim().isLength({ min: 2 }).withMessage('Message is required'),
];
