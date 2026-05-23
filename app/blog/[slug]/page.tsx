import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPost from '@/components/pages/blog/BlogPost';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog';
import { connectToDatabase } from '@/lib/mongodb';
import BlogModel from '@/lib/models/Blog';
import { getBlogPostSchema, getBreadcrumbSchema, getBlogFAQSchema } from '@/lib/seo/structuredData';
import JsonLdScript from '@/components/global/JsonLdScript';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // prefer DB slugs if available, fallback to static posts
  try {
    await connectToDatabase();
    const db = await BlogModel.find({}, { slug: 1 }).lean();
    const dbSlugs = db.map((b: any) => ({ slug: b.slug }));
    if (dbSlugs.length) return dbSlugs;
  } catch (e) {
    // ignore DB errors and fallback to static
  }

  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found | Alvion Digital Marketing',
    };
  }

  return {
    title: { absolute: post.title },
    description: post.excerpt,
    keywords: [post.category || 'digital marketing', 'digital marketing', 'marketing strategy', 'content marketing', post.title],
    authors: [{ name: post.author, url: 'https://alviondigital.in' }],
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
      publishedTime: post.publishedAt as string | undefined,
      modifiedTime: (post as any).updatedAt || (post.publishedAt as string | undefined),
      url: `https://alviondigital.in/blog/${post.slug}`,
      siteName: 'Alvion Digital Marketing',
      images: post.thumbnail ? [
        {
          url: `https://alviondigital.in${post.thumbnail}`,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [
        {
          url: 'https://alviondigital.in/opengraph-image',
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
      images: post.thumbnail ? [`https://alviondigital.in${post.thumbnail}`] : ['https://alviondigital.in/twitter-image'],
    },
    alternates: {
      canonical: `https://alviondigital.in/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  // try DB first, then static
  let post: any = null;
  try {
    await connectToDatabase();
    post = await BlogModel.findOne({ slug }).lean();
  } catch (e) {
    // ignore
  }

  if (!post) {
    post = await getBlogPostBySlug(slug);
  }

  if (!post) notFound();

  const blogFaqSchema = getBlogFAQSchema(post);

  return (
    <>
      <JsonLdScript id="blog-post-schema" data={getBlogPostSchema(post)} />
      <JsonLdScript
        id="breadcrumb-schema"
        data={getBreadcrumbSchema([
          { name: 'Home', url: 'https://alviondigital.in' },
          { name: 'Blog', url: 'https://alviondigital.in/blog' },
          { name: post.title, url: `https://alviondigital.in/blog/${post.slug}` },
        ])}
      />
      {blogFaqSchema && (
        <JsonLdScript id="blog-faq-schema" data={blogFaqSchema} />
      )}
      <main className="pt-16 md:pt-20">
        <BlogPost post={post} />
      </main>
    </>
  );
}