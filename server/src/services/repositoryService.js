import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';
import { getOwnedProject } from './projectService.js';
import { analyzeRepositoryDirectory, extractZip } from '../parsing/repositoryParser.js';
import { updateProjectAnalysis } from './projectService.js';
import { ApiError } from '../utils/ApiError.js';
import { parseSpecificationFile } from '../utils/specParser.js';

export const analyzeUploadedZip = async ({ projectId, userId, file }) => {
  if (!file) throw new ApiError(400, 'Repository ZIP file is required');
  const project = await getOwnedProject({ projectId, userId });
  const destination = path.join('server', 'uploads', `${path.basename(file.filename, '.zip')}-extracted`);
  await extractZip(file.path, destination);
  const analysisResult = await analyzeRepositoryDirectory(destination, project.projectName);
  return updateProjectAnalysis({ projectId, userId, analysisResult });
};

/**
 * Download a URL to a local file, following redirects automatically.
 */
const downloadToFile = (url, destPath) =>
  new Promise((resolve, reject) => {
    const follow = (currentUrl) => {
      const client = currentUrl.startsWith('https') ? https : http;
      client
        .get(currentUrl, { headers: { 'User-Agent': 'qa-testgen-platform/1.0' } }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return follow(res.headers.location);
          }
          if (res.statusCode !== 200) {
            return reject(new ApiError(502, `GitHub returned HTTP ${res.statusCode}. Make sure the repository is public.`));
          }
          const stream = createWriteStream(destPath);
          res.pipe(stream);
          stream.on('finish', resolve);
          stream.on('error', reject);
        })
        .on('error', reject);
    };
    follow(url);
  });

export const analyzeGithubRepository = async ({ projectId, userId, repositoryUrl }) => {
  // Accept both https://github.com/owner/repo and https://github.com/owner/repo/
  const match = repositoryUrl.match(/^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(\.git)?\/?$/);
  if (!match) {
    throw new ApiError(400, 'Only public GitHub repository URLs are supported (e.g. https://github.com/owner/repo)');
  }

  const [, owner, repo] = match;
  const zipUrl = `https://api.github.com/repos/${owner}/${repo}/zipball`;

  await fs.mkdir(path.join('server', 'uploads'), { recursive: true });

  const zipPath = path.join('server', 'uploads', `github-${owner}-${repo}-${Date.now()}.zip`);
  const extractPath = path.join('server', 'uploads', `github-${owner}-${repo}-${Date.now()}-extracted`);

  const project = await getOwnedProject({ projectId, userId });

  try {
    // Download the repo ZIP from GitHub
    await downloadToFile(zipUrl, zipPath);

    // Extract and analyze (pass project name for AI prompt context)
    await extractZip(zipPath, extractPath);
    const analysisResult = await analyzeRepositoryDirectory(extractPath, project.projectName);

    // Attach the original URL
    analysisResult.repositoryUrl = repositoryUrl;

    return updateProjectAnalysis({ projectId, userId, analysisResult });
  } finally {
    // Clean up temp files (best-effort)
    fs.rm(zipPath, { force: true }).catch(() => {});
    fs.rm(extractPath, { recursive: true, force: true }).catch(() => {});
  }
};

export const uploadSpecificationFile = async ({ projectId, userId, file }) => {
  if (!file) throw new ApiError(400, 'Specification file is required');
  const project = await getOwnedProject({ projectId, userId });

  try {
    const text = await parseSpecificationFile(file.path);
    project.specificationText = text;
    project.specificationFileName = file.originalname;
    await project.save();
    return project;
  } catch (error) {
    throw new ApiError(500, `Failed to parse specification file: ${error.message}`);
  } finally {
    // clean up temp file
    fs.rm(file.path, { force: true }).catch(() => {});
  }
};
