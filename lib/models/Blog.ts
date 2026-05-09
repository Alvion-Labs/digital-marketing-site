import { model, models, Schema, type InferSchemaType, type Model } from 'mongoose';

const blogSchema = new Schema(
  {
    slug: { type: String, required: true, trim: true, unique: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, trim: true },
    category: { type: String, trim: true },
    publishedAt: { type: Date },
    readTime: { type: String, trim: true },
    author: { type: String, trim: true },
    accentFrom: { type: String, trim: true },
    accentTo: { type: String, trim: true },
    summary: { type: String, trim: true },
    thumbnail: { type: String, trim: true },
    // full HTML content authored in the editor (allows Tailwind classes)
    contentHTML: { type: String, default: '' },
    // arbitrary JSON sections (optional)
    sections: { type: Array, default: [] },
    takeaways: { type: Array, default: [] },
    // SEO fields
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    canonical: { type: String, trim: true },
    isDraft: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: 'blogs',
  }
);

export type Blog = InferSchemaType<typeof blogSchema>;

const BlogModel = (models.Blog as Model<Blog>) || model<Blog>('Blog', blogSchema);

export default BlogModel;
