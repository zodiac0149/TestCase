import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    projectName: { type: String, required: true, trim: true },
    repositoryUrl: { type: String, trim: true },
    repositorySummary: { type: String, default: '' },
    detectedTechnologies: [{ type: String }],
    analysis: {
      routes: [{ method: String, path: String, file: String }],
      models: [{ name: String, file: String }],
      services: [{ name: String, file: String }],
      folderStructure: { type: String, default: '' },
      architectureSummary: { type: String, default: '' },
      frontendFramework: { type: String, default: 'Unknown' },
      backendFramework: { type: String, default: 'Unknown' },
      aiSummarized: { type: Boolean, default: false },
    },
    specificationText: { type: String, default: '' },
    specificationFileName: { type: String, default: '' },
  },
  { timestamps: true },
);

export const Project = mongoose.model('Project', projectSchema);
