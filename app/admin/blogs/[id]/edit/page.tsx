'use client';

import Link from 'next/link';
import BlogEditorImproved from '@/components/admin/BlogEditorImproved';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AdminPanelSkeleton, AdminPageTitleSkeleton } from '@/components/admin/AdminSkeletons';

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadBlog() {
      try {
        const response = await fetch(`/api/admin/blogs/${params.id}`, { cache: 'no-store' });

        if (response.status === 401) {
          router.replace('/admin/login');
          return;
        }

        if (response.status === 404) {
          router.replace('/admin/blogs');
          return;
        }

        const json = await response.json();
        if (!cancelled) {
          setBlog(json.blog || null);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (params?.id) {
      loadBlog();
    }

    return () => {
      cancelled = true;
    };
  }, [params?.id, router]);

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin/blogs" className="text-gray-600 hover:text-gray-900 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          {loading ? <AdminPageTitleSkeleton /> : <h2 className="text-3xl font-bold admin-heading-gradient">Edit Blog Post</h2>}
          {!loading && <p className="text-gray-600 mt-1">Update your blog content and settings</p>}
        </div>
      </div>

      {loading ? (
        <AdminPanelSkeleton />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          {blog ? <BlogEditorImproved initial={blog} /> : <div className="text-sm text-red-600">Blog post could not be loaded.</div>}
        </div>
      )}
    </div>
  );
}
