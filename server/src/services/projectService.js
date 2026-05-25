import { Project } from '../models/Project.js';
import { Generation } from '../models/Generation.js';
import { ApiError } from '../utils/ApiError.js';

export const createProject = ({ userId, projectName, repositoryUrl }) =>
  Project.create({ userId, projectName, repositoryUrl, detectedTechnologies: [] });

export const listProjects = async (userId) => {
  const projects = await Project.find({ userId }).sort({ createdAt: -1 });
  const recentGenerations = await Generation.find({ projectId: { $in: projects.map((project) => project._id) } })
    .sort({ createdAt: -1 })
    .limit(6);
  return {
    projects,
    recentGenerations,
    stats: {
      projectCount: projects.length,
      generationCount: await Generation.countDocuments({ projectId: { $in: projects.map((project) => project._id) } }),
      analyzedProjects: projects.filter((project) => project.repositorySummary).length,
    },
  };
};

export const getOwnedProject = async ({ projectId, userId }) => {
  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) throw new ApiError(404, 'Project not found');
  return project;
};

export const updateProjectAnalysis = async ({ projectId, userId, analysisResult }) =>
  Project.findOneAndUpdate({ _id: projectId, userId }, { $set: analysisResult }, { new: true });
