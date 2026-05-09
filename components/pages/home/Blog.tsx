import Link from 'next/link';
import Container from '@/components/global/Container';
import Button from '@/components/global/Button';
import BlogCard from '@/components/pages/blog/BlogCard';
import { getFeaturedBlogPosts } from '@/lib/blog';

export default async function BlogSection() {
  const posts = await getFeaturedBlogPosts(3);

  return (
    <section id="blog" className="py-24 bg-transparent">
      <Container>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-14">
          <div className="max-w-2xl">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 rounded-full bg-transparent border border-accent-from/20 text-accent-to text-xs font-semibold uppercase tracking-widest">
                Insights
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mt-3 mb-4">
              Latest blog articles
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Practical marketing advice, content ideas, and performance insights for growing brands.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-full border border-accent-from px-6 py-3 text-sm font-semibold text-accent-from transition-all duration-300 hover:bg-accent-from/10 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent-from"
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