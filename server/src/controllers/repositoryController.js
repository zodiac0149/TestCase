import * as repositoryService from '../services/repositoryService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const uploadRepository = asyncHandler(async (req, res) => {
  const project = await repositoryService.analyzeUploadedZip({ projectId: req.body.projectId, userId: req.user._id, file: req.file });
  sendSuccess(res, project, 'Repository analyzed');
});

export const importGithub = asyncHandler(async (req, res) => {
  const project = await repositoryService.analyzeGithubRepository({ projectId: req.body.projectId, userId: req.user._id, repositoryUrl: req.body.repositoryUrl });
  sendSuccess(res, project, 'GitHub repository connected');
});

export const uploadSpecification = asyncHandler(async (req, res) => {
  const project = await repositoryService.uploadSpecificationFile({ projectId: req.body.projectId, userId: req.user._id, file: req.file });
  sendSuccess(res, project, 'Specification file uploaded and parsed successfully');
});
