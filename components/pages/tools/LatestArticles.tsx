import Link from 'next/link';
import BlogCard from '@/components/pages/blog/BlogCard';
import { getAllBlogPosts, type BlogPost } from '@/lib/blog';
import { toBlogCardPost } from '@/lib/blogCard';

export default async function LatestArticles() {
  const all = await getAllBlogPosts();
  const latest = all.slice(0, 3);

  if (latest.length === 0) return null;

  return (
    <section className="border-t border-gray-100 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Latest articles</h3>
            <p className="text-gray-600 mt-1">Stay ahead with insights from our team</p>
          </div>

          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-1.5 self-end text-sm font-semibold transition-all duration-300 hover:opacity-90 group/link"
            style={{
              backgroundImage: 'linear-gradient(90deg, #1a1054, #255ff1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            View all
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover/link:translate-x-1"
              style={{
                backgroundImage: 'linear-gradient(90deg, #1a1054, #255ff1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latest.map((post: BlogPost) => (
            <BlogCard key={post.slug} post={toBlogCardPost(post)} compact />
          ))}
        </div>
      </div>
    </section>
  );
}