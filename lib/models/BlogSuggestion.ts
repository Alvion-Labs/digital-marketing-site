import { model, models, Schema, type InferSchemaType, type Model } from 'mongoose';

const blogSuggestionSchema = new Schema(
  {
    blogId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
    blogSlug: { type: String, trim: true, default: '' },
    email: { type: String, required: true, trim: true, lowercase: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    suggestion: { type: String, trim: true },
    status: { type: String, enum: ['new', 'reviewed', 'resolved'], default: 'new' },
    adminNotes: { type: String, trim: true, default: '' },
  },
  {
    timestamps: true,
    collection: 'blog_suggestions',
  }
);

export type BlogSuggestion = InferSchemaType<typeof blogSuggestionSchema>;

const BlogSuggestionModel =
  (models.BlogSuggestion as Model<BlogSuggestion>) || model<BlogSuggestion>('BlogSuggestion', blogSuggestionSchema);

export default BlogSuggestionModel;
