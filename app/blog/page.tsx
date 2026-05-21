import type { Metadata } from 'next';
import Container from '@/components/global/Container';
import BlogCard from '@/components/pages/blog/BlogCard';
import TypingHeadline from '@/components/TypingHeadline';
import Button from '@/components/global/Button';
import { getAllBlogPosts } from '@/lib/blog';
import { toBlogCardPost } from '@/lib/blogCard';
import BlogListingFiltersClient from '@/components/pages/blog/BlogListingClient';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read practical marketing insights, social media tips, SEO guidance, and content strategy articles from Alvion Digital Marketing.',
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <main className="pt-12 md:pt-16">
      <section className="blog-hero relative overflow-hidden bg-white flex items-center" style={{ minHeight: 'calc(70vh - var(--header-h))' }}>
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
              <span className="sr-only">Marketing ideas that actually work</span>
              <TypingHeadline
                texts={[
                  'Marketing ideas that actually work',
                  'Simple guides to help you learn',
                  'Latest trends to stay ahead in the market',
                ]}
                speed={45}
                pause={1400}
                className="gradient-text inline-block"
              />
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Explore practical articles to help your brand improve content quality, SEO, ROI, and social media performance for better growth and results.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:justify-center gap-4">
              <Button href="#posts" variant="secondary" className="w-full sm:w-auto px-6 py-3">
                View latest posts
              </Button>
              <Button href="/#contact" variant="primary" className="w-full sm:w-auto px-6 py-3">
                Get Started
              </Button>
            </div>
          </div>
        </Container>

        {/* Separator divider matching other sections */}
        <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent w-full absolute bottom-0 left-0" />
      </section>

      <section id="posts" className="py-16 md:py-24 bg-linear-to-b from-white via-white to-gray-50/50">
        <Container>
          <div className="mb-12 flex max-w-4xl flex-col gap-6 md:gap-8">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-to">Latest insights</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950">
                Fresh and simple marketing ideas
              </h2>
            </div>
            <p className="max-w-2xl text-base md:text-lg leading-7 text-gray-600">
              Explore our latest articles from Alvion Digital Marketing, simple, practical, and designed to help you grow.
            </p>
          </div>

          <div>
            <BlogListingFiltersClient posts={posts.map((p) => toBlogCardPost(p))} />
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