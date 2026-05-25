import { Generation } from '../models/Generation.js';
import { buildTestGenerationPrompt } from '../ai/promptBuilder.js';
import { completeText } from '../ai/aiService.js';
import { retrieveSimilar, storeEmbedding } from '../embeddings/embeddingService.js';
import { getOwnedProject } from './projectService.js';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const generateTests = async ({ userId, projectId, generationType = 'comprehensive', testingGoal, codeSnippet = '', instructions = '' }) => {
  const project = await getOwnedProject({ projectId, userId });
  const similarGenerations = await retrieveSimilar({ projectId, query: `${testingGoal}\n${codeSnippet}\n${instructions}` });
  const prompt = buildTestGenerationPrompt({ project, testingGoal, codeSnippet, instructions, similarGenerations, generationType });
  const generatedContent = await completeText(prompt);
  const generation = await Generation.create({
    projectId,
    generationType,
    testingGoal,
    generatedContent,
    qualityScore: 0,
    promptMetadata: { model: process.env.BEDROCK_MODEL_ID || env.bedrockModelId, retrievedContextCount: similarGenerations.length },
  });
  await storeEmbedding({ projectId, content: generatedContent, metadata: { generationId: generation._id, type: generationType } });
  return generation;
};

export const regenerateTests = async ({ userId, generationId, feedback = {} }) => {
  const original = await Generation.findById(generationId);
  if (!original) throw new ApiError(404, 'Generation not found');
  const project = await getOwnedProject({ projectId: original.projectId, userId });
  original.feedback = { ...original.feedback, ...feedback };
  await original.save();
  return generateTests({
    userId,
    projectId: project._id,
    generationType: original.generationType,
    testingGoal: `${original.testingGoal}\nRegenerate with this feedback: ${JSON.stringify(feedback)}`,
  });
};
