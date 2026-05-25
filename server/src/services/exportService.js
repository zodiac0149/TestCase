import PDFDocument from 'pdfkit';
import { Generation } from '../models/Generation.js';
import { getOwnedProject } from './projectService.js';

const buildMarkdown = (project, generations) => [
  `# ${project.projectName} Test Cases`,
  '',
  project.repositorySummary ? `_${project.repositorySummary}_` : '',
  '',
  ...generations.map((generation) => [
    `## ${generation.generationType} - ${generation.createdAt.toISOString()}`,
    '',
    generation.generatedContent,
    '',
  ].join('\n')),
].join('\n');

export const exportMarkdown = async ({ userId, projectId }) => {
  const project = await getOwnedProject({ projectId, userId });
  const generations = await Generation.find({ projectId }).sort({ createdAt: -1 });
  return buildMarkdown(project, generations);
};

export const exportJson = async ({ userId, projectId }) => {
  const project = await getOwnedProject({ projectId, userId });
  const generations = await Generation.find({ projectId }).sort({ createdAt: -1 });
  return { project, generations };
};

export const exportPdfBuffer = async ({ userId, projectId }) => {
  const markdown = await exportMarkdown({ userId, projectId });
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 48 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.fontSize(11).text(markdown, { width: 500 });
    doc.end();
  });
};
