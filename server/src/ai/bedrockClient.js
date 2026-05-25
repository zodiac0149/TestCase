import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { env } from '../config/env.js';

/**
 * Creates a BedrockRuntimeClient.
 * - If AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY are set, uses explicit credentials (IAM user).
 * - Otherwise falls back to the AWS SDK default credential chain
 *   (env vars, ~/.aws/credentials, EC2 instance role, ECS task role, etc.)
 */
const buildClient = () => {
  const config = { region: env.awsRegion };

  if (env.awsAccessKeyId && env.awsSecretAccessKey) {
    config.credentials = {
      accessKeyId: env.awsAccessKeyId,
      secretAccessKey: env.awsSecretAccessKey,
    };
  }

  return new BedrockRuntimeClient(config);
};

export const bedrockClient = buildClient();
