import { checkAdminAuth } from '@/lib/admin';
import Link from 'next/link';
import BlogActionsClient from '@/components/admin/BlogActionsClient';
import { connectToDatabase } from '@/lib/mongodb';
import BlogModel from '@/lib/models/Blog';

export default async function BlogsPage() {
  await checkAdminAuth();
  await connectToDatabase();
  const blogs = await BlogModel.find({}).sort({ publishedAt: -1 }).lean();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Blog Posts</h2>
          <p className="text-gray-600 mt-1">Manage and publish your blog content</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-4 py-2 bg-accent-from/10 text-accent-from rounded-full text-sm font-semibold">
            Total: {blogs.length}
          </span>
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-accent-from to-accent-to text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent-from/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Blog Post
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {blogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Author</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Published</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Read Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.slug} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium max-w-xs truncate">{blog.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-accent-from/10 text-accent-from rounded-full text-xs font-semibold">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{blog.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{blog.readTime}</td>
                    <td className="px-6 py-4 text-sm flex gap-3">
                      <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        className="text-accent-to hover:underline font-medium"
                      >
                        View →
                      </Link>
                      <Link href={`/admin/blogs/${String(blog._id)}/edit`} className="text-gray-700 hover:underline">Edit</Link>
                      {/* client-side actions */}
                      <BlogActionsClient id={String(blog._id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 text-lg font-medium mb-4">No blog posts yet</p>
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-accent-from to-accent-to text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent-from/30 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
