import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new ApiError(401, 'Authentication token is required');

  const payload = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(payload.sub).select('-password');
  if (!user) throw new ApiError(401, 'Invalid authentication token');

  req.user = user;
  next();
});
