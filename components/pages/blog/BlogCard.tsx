import Link from 'next/link';
import { formatBlogDate, type BlogPost } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPost;
  compact?: boolean;
}

export default function BlogCard({ post, compact = false }: BlogCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl overflow-hidden bg-[#0d2d47] border border-white/5 hover:border-accent-from/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
      <div
        className={`relative shrink-0 overflow-hidden ${compact ? 'h-44' : 'h-52'}`}
        style={{ background: `linear-gradient(135deg, ${post.accentFrom}, ${post.accentTo})` }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_45%)]" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex h-full flex-col justify-between p-5 text-white">
          <span className="inline-flex w-fit items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            {post.category}
          </span>
          <div>
            <p className="text-sm text-white/80">{formatBlogDate(post.publishedAt)}</p>
            <h3 className="mt-2 text-2xl font-bold leading-tight transition-transform duration-300 group-hover:-translate-y-0.5">
              {post.title}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm text-slate-400 leading-relaxed flex-1">{post.excerpt}</p>
        <div className="mt-6 flex items-center justify-between gap-4 text-xs text-slate-500">
          <span>{post.readTime}</span>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-accent-to font-semibold hover:text-white transition-colors"
          >
            Read article
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}