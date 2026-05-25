import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

const signToken = (user) => jwt.sign({ sub: user._id.toString(), email: user.email }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, createdAt: user.createdAt });

export const signup = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'An account already exists for this email');
  const user = await User.create({ name, email, password });
  return { user: publicUser(user), token: signToken(user) };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid email or password');
  return { user: publicUser(user), token: signToken(user) };
};
