import { model, models, Schema, type InferSchemaType, type Model } from 'mongoose';

const mediaUsageSchema = new Schema(
  {
    type: { type: String, required: true },
    field: { type: String, required: true },
    module: { type: String, required: true },
  },
  { _id: false }
);

const mediaSchema = new Schema(
  {
    // File metadata
    filename: { type: String, required: true, unique: true },
    originalName: { type: String, trim: true },
    mimeType: { type: String, trim: true },
    size: { type: Number }, // in bytes
    dimensions: {
      width: { type: Number },
      height: { type: Number },
    },
    
    // Storage info
    storagePath: { type: String, required: true }, // relative path from public/
    publicUrl: { type: String, required: true }, // /blogs/Media/...
    
    // Usage tracking
    usedBy: { type: [mediaUsageSchema], default: [] },
    
    // Admin info
    uploadedBy: { type: String, trim: true }, // admin username
    uploadedAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
    description: { type: String, trim: true },
    tags: [String],
    
    // Deletion soft-delete flag
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'media',
  }
);

// Index for faster lookups
mediaSchema.index({ uploadedAt: -1 });
mediaSchema.index({ isDeleted: 1 });

export type Media = InferSchemaType<typeof mediaSchema>;

const MediaModel = (models.Media as Model<Media>) || model<Media>('Media', mediaSchema);

export default MediaModel;
