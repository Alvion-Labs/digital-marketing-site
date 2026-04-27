import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/global/Navbar';
import Footer from '@/components/global/Footer';
import BlogPost from '@/components/pages/blog/BlogPost';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found | Alvion Digital Marketing',
    };
  }

  return {
    title: `${post.title} | Alvion Digital Marketing`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        <BlogPost post={post} />
      </main>
      <Footer />
    </>
  );
}