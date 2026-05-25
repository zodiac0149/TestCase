import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Walk up from server/src/config → server → project root where .env lives
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/qa-testgen',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // AWS Bedrock
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  bedrockModelId: process.env.BEDROCK_MODEL_ID || 'amazon.nova-pro-v1:0',
  bedrockAnalysisModelId: process.env.BEDROCK_ANALYSIS_MODEL_ID || 'amazon.nova-micro-v1:0',
};
