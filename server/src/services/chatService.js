import { Chat } from '../models/Chat.js';
import { buildChatPrompt } from '../ai/promptBuilder.js';
import { completeText } from '../ai/aiService.js';
import { retrieveSimilar } from '../embeddings/embeddingService.js';
import { getOwnedProject } from './projectService.js';

export const askAssistant = async ({ userId, projectId, message }) => {
  const project = await getOwnedProject({ projectId, userId });
  const [similarGenerations, recentChats] = await Promise.all([
    retrieveSimilar({ projectId, query: message }),
    Chat.find({ projectId }).sort({ createdAt: -1 }).limit(6),
  ]);
  const prompt = buildChatPrompt({ project, message, similarGenerations, recentChats });
  const assistantMessage = await completeText(prompt);
  return Chat.create({ projectId, userMessage: message, assistantMessage });
};
