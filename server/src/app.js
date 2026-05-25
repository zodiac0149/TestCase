import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { authRoutes } from './routes/authRoutes.js';
import { projectRoutes } from './routes/projectRoutes.js';
import { repositoryRoutes } from './routes/repositoryRoutes.js';
import { generationRoutes } from './routes/generationRoutes.js';
import { chatRoutes } from './routes/chatRoutes.js';
import { exportRoutes } from './routes/exportRoutes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

export const app = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/repositories', repositoryRoutes);
app.use('/api/generate', generationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/export', exportRoutes);
app.use(notFound);
app.use(errorHandler);
