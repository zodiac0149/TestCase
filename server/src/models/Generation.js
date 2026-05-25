import mongoose from 'mongoose';

const generationSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    generationType: { type: String, default: 'comprehensive' },
    testingGoal: { type: String, required: true },
    generatedContent: { type: String, required: true },
    qualityScore: { type: Number, default: 0 },
    feedback: {
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      rating: { type: Number, min: 1, max: 5 },
      notes: String,
    },
    promptMetadata: {
      model: String,
      retrievedContextCount: Number,
    },
  },
  { timestamps: true },
);

export const Generation = mongoose.model('Generation', generationSchema);
