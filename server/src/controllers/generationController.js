import * as generationService from '../services/generationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const generateTests = asyncHandler(async (req, res) => {
  const generation = await generationService.generateTests({ userId: req.user._id, ...req.body });
  sendSuccess(res, generation, 'Tests generated', 201);
});

export const regenerateTests = asyncHandler(async (req, res) => {
  const generation = await generationService.regenerateTests({ userId: req.user._id, ...req.body });
  sendSuccess(res, generation, 'Tests regenerated', 201);
});
