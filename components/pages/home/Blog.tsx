import Link from 'next/link';
import Container from '@/components/global/Container';
import Button from '@/components/global/Button';
import Badge from '@/components/global/Badge';
import BlogCard from '@/components/pages/blog/BlogCard';
import { getFeaturedBlogPosts } from '@/lib/blog';
import { toBlogCardPost } from '@/lib/blogCard';

export default async function BlogSection() {
  const posts = await getFeaturedBlogPosts(3);

  return (
    <section id="blog" className="py-24 bg-transparent">
      <Container>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-14">
          <div className="max-w-2xl">
            <div className="inline-block mb-4">
              <Badge ariaLabel="section label">Insights</Badge>
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
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 hover:opacity-90 group/link"
            style={{
              backgroundImage: 'linear-gradient(90deg, #1a1054, #255ff1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            View all posts
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={toBlogCardPost(post)} compact />
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <Button href="/#contact" variant="primary" size="lg">
            Get Started
          </Button>
        </div>
      </Container>
    </section>
  );
}