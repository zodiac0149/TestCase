import * as authService from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const signup = asyncHandler(async (req, res) => {
  const data = await authService.signup(req.body);
  sendSuccess(res, data, 'Account created', 201);
});

export const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  sendSuccess(res, data, 'Logged in');
});
