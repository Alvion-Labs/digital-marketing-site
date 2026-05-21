"use client";

import { useState } from 'react';
import Link from 'next/link';
import type { BlogCardPost } from '@/lib/blogCard';

function formatBlogDate(date: string | Date | undefined) {
  if (!date) return '-';
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

interface BlogCardProps {
  post: BlogCardPost;
  compact?: boolean;
}

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

export default function BlogCard({ post, compact = false }: BlogCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const imageSrc = post.thumbnail || getCoverImage(post.slug);

  const openPreview = () => {
    setIsPreviewOpen(true);
    setIsPreviewLoading(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setIsPreviewLoading(false);
  };

  return (
    <>
      <article className="group relative flex h-full flex-col rounded-4xl bg-[#f0f4f9] p-3 transition-all duration-300 hover:-translate-y-0.5 sm:p-4">

        <button
          type="button"
          aria-label={`Open preview image for ${post.title}`}
          onClick={openPreview}
          className={`relative block w-full shrink-0 overflow-hidden rounded-[1.6rem] text-left group/preview ${compact ? 'aspect-16/11 sm:aspect-16/10' : 'aspect-16/10 sm:aspect-video'}`}
          style={!post.thumbnail ? { background: `linear-gradient(135deg, ${post.accentFrom}, ${post.accentTo})` } : {}}
        >
          <img
            src={imageSrc}
            alt={post.title}
            className="absolute inset-0 h-full w-full rounded-[1.6rem] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
          {/* Theme gradient text read time badge */}
          <div className="absolute top-4 right-4 backdrop-blur-lg bg-white/35 border border-white/40 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-950 shadow-lg transition-all duration-300 hover:shadow-xl">
            {post.readTime ? `${post.readTime} min read` : 'Read time'}
          </div>
        </button>

        {/* Horizontal separator */}
        <div className="h-0.5 w-16 bg-gray-300 mx-3 my-3 sm:mx-4 sm:my-3 rounded-full" />

        <div className="relative z-10 flex flex-1 flex-col px-2 pt-0 sm:px-3 sm:pt-0">
          <h3 className="text-[1.22rem] font-semibold leading-tight tracking-tight text-gray-950 transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-[1.35rem] md:text-[1.45rem]">
            {post.title}
          </h3>

          <p className="mt-2 flex-1 text-sm leading-6 text-gray-600" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden' }}>
            {post.excerpt}
          </p>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <span>{formatBlogDate(post.publishedAt)}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>By {post.author || 'Alvion Digital Team'}</span>
          </div>

          <div className="mt-3.5 flex items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-wide transition-all duration-300" style={{ backgroundImage: 'linear-gradient(90deg, #1a1054, #255ff1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {post.category || 'Blog'}
            </span>
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex w-fit items-center gap-1.5 border-b border-transparent pb-0.5 text-sm font-semibold transition-all duration-300 hover:border-accent-from/60 group/link"
              style={{ backgroundImage: 'linear-gradient(90deg, #1a1054, #255ff1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              Read article
              <span aria-hidden className="transition-transform duration-300 group-hover/link:translate-x-1" style={{ backgroundImage: 'linear-gradient(90deg, #1a1054, #255ff1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>→</span>
            </Link>
          </div>
        </div>
      </article>

      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/75 p-4"
          onClick={closePreview}
          role="dialog"
          aria-modal="true"
          aria-label={`${post.title} image preview`}
        >
          <button
            type="button"
            aria-label="Close image preview"
            onClick={closePreview}
            className="absolute right-4 top-4 rounded-full border border-white/25 bg-black/40 px-3 py-1 text-sm font-semibold text-white"
          >
            ✕
          </button>

          {isPreviewLoading && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-3 rounded-full border border-white/20 bg-black/45 px-4 py-2 text-sm text-white">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                Loading preview...
              </div>
            </div>
          )}

          <img
            src={imageSrc}
            alt={post.title}
            className={`max-h-[88vh] w-auto max-w-[94vw] rounded-2xl object-contain transition-opacity duration-300 ${isPreviewLoading ? 'opacity-0' : 'opacity-100'}`}
            onLoad={() => setIsPreviewLoading(false)}
            onError={() => setIsPreviewLoading(false)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}