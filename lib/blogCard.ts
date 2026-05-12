export interface BlogCardPost {
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  publishedAt?: string;
  readTime?: string;
  author?: string;
  accentFrom?: string;
  accentTo?: string;
  thumbnail?: string;
}

interface BlogCardPostInput {
  slug?: unknown;
  title?: unknown;
  excerpt?: unknown;
  category?: unknown;
  publishedAt?: unknown;
  readTime?: unknown;
  author?: unknown;
  accentFrom?: unknown;
  accentTo?: unknown;
  thumbnail?: unknown;
}

export function toBlogCardPost(post: BlogCardPostInput): BlogCardPost {
  const publishedAt = post.publishedAt
    ? new Date(post.publishedAt as string | number | Date).toISOString()
    : undefined;

  return {
    slug: typeof post.slug === 'string' ? post.slug : '',
    title: typeof post.title === 'string' ? post.title : '',
    excerpt: typeof post.excerpt === 'string' ? post.excerpt : undefined,
    category: typeof post.category === 'string' ? post.category : undefined,
    publishedAt,
    readTime: typeof post.readTime === 'string' ? post.readTime : undefined,
    author: typeof post.author === 'string' ? post.author : undefined,
    accentFrom: typeof post.accentFrom === 'string' ? post.accentFrom : undefined,
    accentTo: typeof post.accentTo === 'string' ? post.accentTo : undefined,
    thumbnail: typeof post.thumbnail === 'string' ? post.thumbnail : undefined,
  };
}
