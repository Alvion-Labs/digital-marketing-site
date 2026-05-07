import type { Metadata } from 'next';
import Navbar from '@/components/global/Navbar';
import Footer from '@/components/global/Footer';
import Container from '@/components/global/Container';
import BlogCard from '@/components/pages/blog/BlogCard';
import { getAllBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog | Alvion Digital Marketing',
  description: 'Read practical marketing insights, social media tips, SEO guidance, and content strategy articles from Alvion Digital Marketing.',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        <section className="relative overflow-hidden bg-white py-24 md:py-28">
          <div className="absolute top-1/4 -left-32 w-80 h-80 bg-accent-from/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent-to/20 rounded-full blur-3xl pointer-events-none" />

          <Container className="relative z-10">
            <div className="max-w-3xl">
              <span className="text-accent-to text-sm font-semibold uppercase tracking-widest">Blog</span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mt-3 mb-5">
                Marketing ideas, insights, and how-to guides
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                Explore articles designed to help brands improve content planning, paid media, SEO, and social performance.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-20 bg-white">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
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
                We don't just write about marketing strategies — we implement them for businesses like yours every day. Let's talk about how we can help you grow.
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
      <Footer />
    </>
  );
}