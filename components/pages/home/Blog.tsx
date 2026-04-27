import Link from 'next/link';
import Container from '@/components/global/Container';
import Button from '@/components/global/Button';
import BlogCard from '@/components/pages/blog/BlogCard';
import { getFeaturedBlogPosts } from '@/lib/blog';

export default function BlogSection() {
  const posts = getFeaturedBlogPosts(3);

  return (
    <section id="blog" className="py-24 bg-[#061c2e]">
      <Container>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-14">
          <div className="max-w-2xl">
            <span className="text-accent-to text-sm font-semibold uppercase tracking-widest">Insights</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-3 mb-4">
              Latest blog articles
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Practical marketing advice, content ideas, and performance insights for growing brands.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-lg border border-accent-from/40 bg-accent-from/10 px-5 py-3 text-sm font-semibold text-accent-to transition-colors hover:bg-accent-from/20 hover:text-white"
          >
            View all posts
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} compact />
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <Button href="/#contact" variant="primary" className="px-8 py-3">
            Get Started
          </Button>
        </div>
      </Container>
    </section>
  );
}