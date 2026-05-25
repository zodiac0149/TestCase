import * as projectService from '../services/projectService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject({ userId: req.user._id, ...req.body });
  sendSuccess(res, project, 'Project created', 201);
});

export const listProjects = asyncHandler(async (req, res) => {
  const data = await projectService.listProjects(req.user._id);
  sendSuccess(res, data, 'Projects loaded');
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getOwnedProject({ projectId: req.params.id, userId: req.user._id });
  sendSuccess(res, project, 'Project loaded');
});
