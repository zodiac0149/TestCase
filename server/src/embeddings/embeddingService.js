import crypto from 'crypto';
import { Embedding } from '../models/Embedding.js';

const DIMENSIONS = 96;

export const createLocalEmbedding = (content) => {
  const vector = Array.from({ length: DIMENSIONS }, () => 0);
  const tokens = String(content).toLowerCase().match(/[a-z0-9_]+/g) || [];
  tokens.forEach((token) => {
    const hash = crypto.createHash('sha256').update(token).digest();
    const index = hash[0] % DIMENSIONS;
    vector[index] += 1;
  });
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
  return vector.map((value) => Number((value / norm).toFixed(6)));
};

const cosineSimilarity = (a, b) => a.reduce((sum, value, index) => sum + value * (b[index] || 0), 0);

export const storeEmbedding = async ({ projectId, content, metadata }) => {
  const embedding = createLocalEmbedding(content);
  return Embedding.create({ projectId, embedding, content, metadata });
};

export const retrieveSimilar = async ({ projectId, query, limit = 4 }) => {
  const queryEmbedding = createLocalEmbedding(query);
  const records = await Embedding.find({ projectId }).sort({ createdAt: -1 }).limit(100);
  return records
    .map((record) => ({ record, score: cosineSimilarity(queryEmbedding, record.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ record, score }) => ({
      content: record.content,
      metadata: record.metadata,
      score,
    }));
};
