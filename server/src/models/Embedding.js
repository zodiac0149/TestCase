import mongoose from 'mongoose';

const embeddingSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    embedding: [{ type: Number }],
    content: { type: String, required: true },
    metadata: {
      type: new mongoose.Schema(
        {
          generationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Generation' },
          type: { type: String },
          rating: { type: Number },
        },
        { _id: false },
      ),
      default: {},
    },
  },
  { timestamps: true },
);

export const Embedding = mongoose.model('Embedding', embeddingSchema);
