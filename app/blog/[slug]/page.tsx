import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/global/Navbar';
import Footer from '@/components/global/Footer';
import BlogPost from '@/components/pages/blog/BlogPost';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog';
import { getBlogPostSchema, getBreadcrumbSchema } from '@/lib/seo/structuredData';

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
    keywords: [post.category, 'digital marketing', 'marketing strategy', 'content marketing', post.title],
    authors: [{ name: post.author, url: 'https://alviondigital.com' }],
    creator: post.author,
    publisher: 'Alvion Digital Marketing',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.publishedAt,
      url: `https://alviondigital.com/blog/${post.slug}`,
      siteName: 'Alvion Digital Marketing',
      images: post.thumbnail ? [
        {
          url: `https://alviondigital.com${post.thumbnail}`,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [
        {
          url: 'https://alviondigital.com/og-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      creator: '@alviondigital',
      images: post.thumbnail ? [`https://alviondigital.com${post.thumbnail}`] : ['https://alviondigital.com/og-image.png'],
    },
    alternates: {
      canonical: `https://alviondigital.com/blog/${post.slug}`,
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBlogPostSchema(post)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getBreadcrumbSchema([
            { name: 'Home', url: 'https://alviondigital.com' },
            { name: 'Blog', url: 'https://alviondigital.com/blog' },
            { name: post.title, url: `https://alviondigital.com/blog/${post.slug}` },
          ])),
        }}
      />
      <Navbar />
      <main className="pt-16 md:pt-20">
        <BlogPost post={post} />
      </main>
      <Footer />
    </>
  );
}