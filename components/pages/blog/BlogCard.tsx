import Link from 'next/link';
import { formatBlogDate, type BlogPost } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPost;
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
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-sm transition-all duration-400 hover:-translate-y-1 hover:border-accent-from/40 hover:shadow-2xl hover:shadow-blue-500/15">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100 bg-linear-to-b from-accent-from/4 via-transparent to-accent-to/5" />

      <div
        className={`relative shrink-0 overflow-hidden ${compact ? 'h-44' : 'h-52'} rounded-t-2xl`}
        style={!post.thumbnail ? { background: `linear-gradient(135deg, ${post.accentFrom}, ${post.accentTo})` } : {}}
      >
        <img
          src={post.thumbnail || getCoverImage(post.slug)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 z-10">
          <span className="rounded-full border border-white/35 bg-black/40 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            {post.readTime}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-medium text-gray-500">{formatBlogDate(post.publishedAt)}</span>
          <span className="text-gray-300">•</span>
          <span className="text-xs font-medium text-accent-to">{post.category}</span>
        </div>
        
        <h3 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-gray-900 mb-3 transition-transform duration-300 group-hover:-translate-y-0.5">
          {post.title}
        </h3>
      
        <p className="flex-1 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
          <span className="text-xs font-medium text-slate-500">By {post.author}</span>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-accent-from/30 bg-accent-from/10 px-3 py-1.5 text-xs font-semibold text-accent-to transition-all duration-300 hover:border-accent-from/60 hover:bg-accent-from/15 hover:text-accent-from"
          >
            Read article
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}