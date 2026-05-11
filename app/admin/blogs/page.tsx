'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BlogActionsClient from '@/components/admin/BlogActionsClient';
import { AdminPageTitleSkeleton, AdminTableSkeleton } from '@/components/admin/AdminSkeletons';

type Blog = {
  _id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  publishedAt?: string;
  updatedAt?: string;
  thumbnail?: string;
  isDraft?: boolean;
  readTime: string;
};

const coverImages = [
  'https://picsum.photos/seed/marketing-strategy/960/540',
  'https://picsum.photos/seed/social-growth/960/540',
  'https://picsum.photos/seed/content-planning/960/540',
  'https://picsum.photos/seed/seo-analytics/960/540',
  'https://picsum.photos/seed/performance-ads/960/540',
  'https://picsum.photos/seed/brand-story/960/540',
];

function getCoverImage(slug: string) {
  const total = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return coverImages[total % coverImages.length];
}

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    let cancelled = false;

    async function loadBlogs() {
      try {
        const response = await fetch('/api/admin/blogs', { cache: 'no-store' });

        if (response.status === 401) {
          router.replace('/admin/login');
          return;
        }

        const json = await response.json();
        if (!cancelled) {
          setBlogs(Array.isArray(json.blogs) ? json.blogs : []);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBlogs();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusLabel = (blog: Blog) => (blog.isDraft ? 'Draft' : 'Published');

  const getStatusClasses = (blog: Blog) =>
    blog.isDraft
      ? 'bg-amber-50 text-amber-700 ring-amber-200'
      : 'bg-emerald-50 text-emerald-700 ring-emerald-200';

  return (
    <div>
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          {loading ? <AdminPageTitleSkeleton /> : <h2 className="text-3xl font-bold admin-heading-gradient">Blog Posts</h2>}
          {!loading && <p className="text-gray-600 mt-1">Manage and publish your blog content</p>}
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <span className="px-4 py-2 bg-accent-from/10 text-accent-from rounded-full text-sm font-semibold">
            Total: {loading ? '...' : blogs.length}
          </span>
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 border border-gray-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
              title="Grid view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
              </svg>
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
              title="List view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
              </svg>
              Rows
            </button>
          </div>
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-accent-from to-accent-to text-white rounded-full font-semibold hover:shadow-lg hover:shadow-accent-from/30 transition-all duration-300 hover:-translate-y-0.5 hover:cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Blog Post
          </Link>
        </div>
      </div>

      {loading ? (
        <AdminTableSkeleton rows={5} columns={6} />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          {blogs.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {blogs.map((blog) => (
                    <article key={blog.slug} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-accent-from/30">
                      <div className="relative mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-sm">
                        <div className="group relative aspect-video overflow-hidden">
                          <img
                            src={blog.thumbnail || getCoverImage(blog.slug)}
                            alt={blog.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/0 to-transparent" />
                          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                            <span className={`shrink-0 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset backdrop-blur-sm ${getStatusClasses(blog)}`}>
                              <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                              {getStatusLabel(blog)}
                            </span>
                            <span className="shrink-0 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-accent-to shadow-sm backdrop-blur-sm">
                              {blog.readTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug">{blog.title}</h3>
                          <p className="mt-1 text-sm text-gray-500 truncate">/{blog.slug}</p>
                        </div>
                        <span className="shrink-0 px-3 py-1 bg-accent-from/10 text-accent-from rounded-full text-xs font-semibold">
                          {blog.category}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                        {blog.thumbnail ? 'Has featured image selected.' : 'No thumbnail selected yet. Add one to make the card more visual.'}
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                          <p className="text-xs font-semibold text-gray-500 mb-1">Author</p>
                          <p className="font-medium text-gray-900 truncate">{blog.author}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                          <p className="text-xs font-semibold text-gray-500 mb-1">Read Time</p>
                          <p className="font-medium text-gray-900">{blog.readTime}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                          <p className="text-xs font-semibold text-gray-500 mb-1">Published</p>
                          <p className="font-medium text-gray-900">{formatDate(blog.publishedAt)}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                          <p className="text-xs font-semibold text-gray-500 mb-1">Updated</p>
                          <p className="font-medium text-gray-900">{formatDate(blog.updatedAt)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <Link href={`/blog/${blog.slug}`} target="_blank" className="inline-flex items-center rounded-full border border-accent-from/20 bg-accent-from/10 px-3 py-1.5 font-semibold text-accent-to transition-all hover:border-accent-from/40 hover:bg-accent-from/15 hover:text-accent-from">
                            View →
                          </Link>
                          <Link href={`/admin/blogs/${String(blog._id)}/edit`} className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900">
                            Edit
                          </Link>
                        </div>
                        <BlogActionsClient id={String(blog._id)} />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-2">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Dates</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Read Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog.slug} className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                        <td className="px-6 py-5 text-sm text-gray-900 font-medium max-w-xs">
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 line-clamp-1">{blog.title}</p>
                            <p className="mt-1 text-xs text-gray-500 truncate">/{blog.slug}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-600">
                          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusClasses(blog)}`}>
                            <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                            {getStatusLabel(blog)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="px-3 py-1 bg-accent-from/10 text-accent-from rounded-full text-xs font-semibold">{blog.category}</span>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-600">
                          <div className="space-y-1 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2">
                            <p><span className="text-gray-500">Published:</span> {formatDate(blog.publishedAt)}</p>
                            <p><span className="text-gray-500">Updated:</span> {formatDate(blog.updatedAt)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-600">
                          <span className="inline-flex items-center rounded-full bg-gray-50 border border-gray-200 px-3 py-1 font-medium">{blog.readTime}</span>
                        </td>
                        <td className="px-6 py-5 text-sm">
                          <div className="flex flex-wrap gap-2">
                            <Link href={`/blog/${blog.slug}`} target="_blank" className="inline-flex items-center rounded-full border border-accent-from/20 bg-accent-from/10 px-3 py-1.5 font-semibold text-accent-to transition-all hover:border-accent-from/40 hover:bg-accent-from/15 hover:text-accent-from">View</Link>
                            <Link href={`/admin/blogs/${String(blog._id)}/edit`} className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900">Edit</Link>
                          <BlogActionsClient id={String(blog._id)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 text-lg font-medium mb-4">No blog posts yet</p>
              <Link href="/admin/blogs/new" className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-accent-from to-accent-to text-white rounded-full font-semibold hover:shadow-lg hover:shadow-accent-from/30 transition-all duration-300 hover:cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Post
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
