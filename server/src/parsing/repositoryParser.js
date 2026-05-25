import fs from 'fs/promises';
import { createReadStream } from 'fs';
import path from 'path';
import unzipper from 'unzipper';
import { completeAnalysis } from '../ai/aiService.js';
import { buildRepoAnalysisPrompt } from '../ai/promptBuilder.js';

const CODE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.json']);
const MAX_FILE_BYTES = 250_000;

const walk = async (directory, root = directory, files = []) => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(fullPath, root, files);
    if (entry.isFile() && CODE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push({ fullPath, relativePath: path.relative(root, fullPath) });
    }
  }
  return files;
};

export const extractZip = async (zipPath, destination) => {
  await fs.mkdir(destination, { recursive: true });
  await createReadStream(zipPath).pipe(unzipper.Extract({ path: destination })).promise();
  return destination;
};

const detectTechnologies = (files, contents) => {
  const joined = contents.join('\n');
  const technologies = new Set();
  if (/react|jsx|tsx|vite/i.test(joined)) technologies.add('React');
  if (/express|app\.(get|post|put|delete|patch)/i.test(joined)) technologies.add('Express.js');
  if (/mongoose|mongodb/i.test(joined)) technologies.add('MongoDB');
  if (files.some((file) => file.relativePath.endsWith('.ts') || file.relativePath.endsWith('.tsx'))) technologies.add('TypeScript');
  if (files.some((file) => file.relativePath.endsWith('.js') || file.relativePath.endsWith('.jsx'))) technologies.add('JavaScript');
  if (files.some((file) => file.relativePath.endsWith('package.json'))) technologies.add('Node.js');
  return [...technologies];
};

const detectRoutes = (filesWithContent) => {
  const routes = [];
  const routeRegex = /\.(get|post|put|patch|delete)\(['\"`]([^'\"`]+)['\"`]/gi;
  filesWithContent.forEach(({ relativePath, content }) => {
    let match = routeRegex.exec(content);
    while (match) {
      routes.push({ method: match[1].toUpperCase(), path: match[2], file: relativePath });
      match = routeRegex.exec(content);
    }
  });
  return routes;
};

const detectModels = (filesWithContent) =>
  filesWithContent
    .filter(({ content }) => /mongoose\.model|new mongoose\.Schema|Schema\(/.test(content))
    .map(({ relativePath }) => ({ name: path.basename(relativePath, path.extname(relativePath)), file: relativePath }));

const detectServices = (filesWithContent) =>
  filesWithContent
    .filter(({ relativePath }) => /service/i.test(relativePath))
    .map(({ relativePath }) => ({ name: path.basename(relativePath, path.extname(relativePath)), file: relativePath }));

const folderTree = (files) =>
  files
    .slice(0, 150)
    .map((file) => file.relativePath.split(path.sep).join('/'))
    .sort()
    .join('\n');

/**
 * Build a regex-based architecture summary as a reliable fallback.
 */
const buildRegexSummary = ({ detectedTechnologies, routes, models, frontendFramework, backendFramework }) =>
  [
    `Frontend framework: ${frontendFramework}.`,
    `Backend framework: ${backendFramework}.`,
    `Primary technologies: ${detectedTechnologies.join(', ') || 'Unknown'}.`,
    routes.length
      ? `API surface includes ${routes.map((r) => `${r.method} ${r.path}`).slice(0, 10).join(', ')}.`
      : 'No Express routes detected.',
    models.length
      ? `Data models detected: ${models.map((m) => m.name).join(', ')}.`
      : 'No database models detected.',
  ].join(' ');

export const analyzeRepositoryDirectory = async (directory, projectName = '') => {
  const files = await walk(directory);
  const filesWithContent = [];

  for (const file of files.slice(0, 120)) {
    const stat = await fs.stat(file.fullPath);
    if (stat.size > MAX_FILE_BYTES) continue;
    filesWithContent.push({ ...file, content: await fs.readFile(file.fullPath, 'utf8') });
  }

  const contents = filesWithContent.map((file) => file.content);
  const detectedTechnologies = detectTechnologies(files, contents);
  const routes = detectRoutes(filesWithContent);
  const models = detectModels(filesWithContent);
  const services = detectServices(filesWithContent);
  const folderStructure = folderTree(files);
  const frontendFramework = detectedTechnologies.includes('React') ? 'React' : 'Unknown';
  const backendFramework = detectedTechnologies.includes('Express.js') ? 'Express.js' : 'Unknown';
  const repositorySummary = `${files.length} source/config files scanned. Found ${routes.length} routes, ${models.length} models, and ${services.length} services.`;

  // ── AI-enhanced architecture summary (Claude Haiku via Bedrock) ─────────────
  const regexSummary = buildRegexSummary({ detectedTechnologies, routes, models, frontendFramework, backendFramework });

  const aiPrompt = buildRepoAnalysisPrompt({
    projectName,
    technologies: detectedTechnologies,
    routes,
    models,
    services,
    folderStructure,
    fileCount: files.length,
  });

  // completeAnalysis returns null if credentials are absent → fall back to regex
  const aiSummary = await completeAnalysis(aiPrompt);
  const architectureSummary = aiSummary?.trim() || regexSummary;
  const aiSummarized = Boolean(aiSummary?.trim());

  return {
    repositorySummary,
    detectedTechnologies,
    analysis: {
      routes,
      models,
      services,
      folderStructure,
      architectureSummary,
      frontendFramework,
      backendFramework,
      aiSummarized,
    },
  };
};
