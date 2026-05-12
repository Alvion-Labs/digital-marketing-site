import Link from 'next/link';
import BlogCard from '@/components/pages/blog/BlogCard';
import { getAllBlogPosts, type BlogPost } from '@/lib/blog';
import { toBlogCardPost } from '@/lib/blogCard';

interface Props {
  category?: string;
  currentSlug: string;
}

export default async function RelatedPosts({ category, currentSlug }: Props) {
  const all = await getAllBlogPosts();
  // Prefer same-category posts
  let related = all.filter((p) => p.slug !== currentSlug && p.category === category);
  if (related.length < 3) {
    const fallback = all.filter((p) => p.slug !== currentSlug && !related.find(r => r.slug === p.slug));
    related = [...related, ...fallback].slice(0, 3);
  } else {
    related = related.slice(0, 3);
  }

  if (related.length === 0) return null;

  return (
    <section className="mt-20">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Related articles</h3>
        <p className="text-gray-600 mt-1">More posts you may find useful</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((post: BlogPost) => (
          <BlogCard key={post.slug} post={toBlogCardPost(post)} compact />
        ))}
      </div>
    </section>
  );
}
