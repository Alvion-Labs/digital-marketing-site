import type { Metadata } from 'next';
import Container from '@/components/global/Container';
import BlogCard from '@/components/pages/blog/BlogCard';
import TypingHeadline from '@/components/TypingHeadline';
import Button from '@/components/global/Button';
import { getAllBlogPosts } from '@/lib/blog';
import { toBlogCardPost } from '@/lib/blogCard';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read practical marketing insights, social media tips, SEO guidance, and content strategy articles from Alvion Digital Marketing.',
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <main className="pt-16 md:pt-20">
      <section className="blog-hero relative overflow-hidden bg-white flex items-center" style={{ minHeight: 'calc(100vh - var(--header-h))' }}>
        <style>{`
          .blog-hero { --header-h: 4rem; }
          @media (min-width: 768px) { .blog-hero { --header-h: 5rem; } }
        `}</style>
        <Container className="relative z-10">
          <div className="max-w-4xl text-center mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-from/20 bg-transparent text-accent-to text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-accent-to animate-pulse" />
              Blogs
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mt-3 mb-4">
              <TypingHeadline
                texts={[
                  'Marketing ideas, insights, and how-to guides',
                  'Content strategy, SEO & paid media tips',
                  'Practical advice for growing brands',
                ]}
                speed={45}
                pause={1400}
                className="gradient-text inline-block"
              />
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Explore articles designed to help brands improve content planning, paid media, SEO, and social performance.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Button href="#posts" variant="secondary" className="text-sm px-6 py-3">
                View latest posts
              </Button>
              <Button href="/#contact" variant="primary" className="text-sm px-6 py-3">
                Get Started
              </Button>
            </div>
          </div>
        </Container>

        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2">
          <a
            href="#posts"
            aria-label="Scroll to posts"
            className="group inline-flex items-center gap-1.5 rounded-full border border-accent-from/40 bg-transparent px-3 py-1.5 text-accent-from shadow-sm shadow-accent-from/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-from/8 hover:shadow-md hover:shadow-accent-from/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-from/30 focus-visible:ring-offset-2"
          >
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-accent-from/90">Scroll</span>
            <span className="relative h-4 w-4">
              <svg className="absolute inset-0 h-4 w-4 motion-safe:animate-[bounce_1.8s_infinite] motion-reduce:animate-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <svg className="absolute inset-0 h-4 w-4 translate-y-0.5 opacity-25 group-hover:opacity-55 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </a>
        </div>
      </section>

      <section id="posts" className="py-12 bg-white">
        <Container>
          <div className="mx-auto mb-8 flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-to">Latest insights</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">
                Fresh marketing ideas, strategies, and practical how-tos
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-gray-600 sm:text-right">
              Browse the newest articles from Alvion Digital Marketing. Each post is written to be useful, actionable, and easy to apply.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={toBlogCardPost(post)} />
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action Section */}
      <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent w-full" />
      
      <section className="py-16 md:py-24 bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to put these ideas into action?
            </h2>
            <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              We don't just write about marketing strategies, we implement them for businesses like yours every day. Let's talk about how we can help you grow.
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-accent-from to-accent-to px-8 py-4 text-base font-semibold text-white shadow-lg shadow-accent-from/20 hover:shadow-xl hover:shadow-accent-from/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Get in touch with our team
            </a>
          </div>
        </Container>
      </section>
    </main>
  );
}