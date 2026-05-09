import { checkAdminAuth } from '@/lib/admin';
import Link from 'next/link';
import BlogEditorClient from '@/components/admin/BlogEditorClient';
import { connectToDatabase } from '@/lib/mongodb';
import BlogModel from '@/lib/models/Blog';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  await checkAdminAuth();
  await connectToDatabase();
  const blog = await BlogModel.findById(id).lean();
  if (!blog) notFound();

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin/blogs" className="text-gray-600 hover:text-gray-900 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Edit Blog Post</h2>
          <p className="text-gray-600 mt-1">Update your blog content and settings</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <BlogEditorClient initial={blog} />
      </div>
    </div>
  );
}
