import * as chatService from '../services/chatService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const chat = asyncHandler(async (req, res) => {
  const response = await chatService.askAssistant({ userId: req.user._id, projectId: req.body.projectId, message: req.body.message });
  sendSuccess(res, response, 'Assistant response generated');
});
