import type { SocialPost } from '@/lib/api';

const GRAPH_API_VERSION = process.env.META_GRAPH_VERSION ?? 'v20.0';
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;
const DEFAULT_LIMIT = 6;

const fallbackInstagramImage = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80';
const fallbackFacebookImage = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80';

type InstagramMediaItem = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  like_count?: number;
};

type FacebookPostItem = {
  id: string;
  message?: string;
  full_picture?: string;
  permalink_url?: string;
  created_time?: string;
  reactions?: {
    summary?: {
      total_count?: number;
    };
  };
};

function buildGraphUrl(pathname: string, params: Record<string, string>) {
  const url = new URL(`${GRAPH_API_BASE}${pathname}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url;
}

function normalizeInstagramPost(item: InstagramMediaItem): SocialPost {
  return {
    id: item.id,
    imageUrl: item.media_url || item.thumbnail_url || fallbackInstagramImage,
    caption: item.caption || '',
    platform: 'instagram',
    date: item.timestamp || new Date().toISOString(),
    likes: item.like_count ?? 0,
    link: item.permalink || '#',
  };
}

function normalizeFacebookPost(item: FacebookPostItem): SocialPost {
  return {
    id: item.id,
    imageUrl: item.full_picture || fallbackFacebookImage,
    caption: item.message || '',
    platform: 'facebook',
    date: item.created_time || new Date().toISOString(),
    likes: item.reactions?.summary?.total_count ?? 0,
    link: item.permalink_url || '#',
  };
}

async function fetchInstagramPosts() {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const instagramUserId = process.env.META_INSTAGRAM_USER_ID;

  if (!accessToken || !instagramUserId) {
    return {
      posts: [],
      error: 'Missing META_ACCESS_TOKEN or META_INSTAGRAM_USER_ID.',
    };
  }

  const url = buildGraphUrl(`/${instagramUserId}/media`, {
    fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count',
    limit: String(DEFAULT_LIMIT),
    access_token: accessToken,
  });

  const response = await fetch(url.toString(), { cache: 'no-store' });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      posts: [],
      error: `Instagram API request failed (${response.status}): ${errorText}`,
    };
  }

  const data = (await response.json()) as { data?: InstagramMediaItem[] };
  return {
    posts: (data.data ?? []).map(normalizeInstagramPost),
  };
}

async function fetchFacebookPosts() {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const facebookPageId = process.env.META_FACEBOOK_PAGE_ID;

  if (!accessToken || !facebookPageId) {
    return {
      posts: [],
      error: 'Missing META_ACCESS_TOKEN or META_FACEBOOK_PAGE_ID.',
    };
  }

  const url = buildGraphUrl(`/${facebookPageId}/posts`, {
    fields: 'id,message,full_picture,permalink_url,created_time,reactions.summary(true)',
    limit: String(DEFAULT_LIMIT),
    access_token: accessToken,
  });

  const response = await fetch(url.toString(), { cache: 'no-store' });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      posts: [],
      error: `Facebook API request failed (${response.status}): ${errorText}`,
    };
  }

  const data = (await response.json()) as { data?: FacebookPostItem[] };
  return {
    posts: (data.data ?? []).map(normalizeFacebookPost),
  };
}

export async function GET() {
  const [instagramResult, facebookResult] = await Promise.all([fetchInstagramPosts(), fetchFacebookPosts()]);

  return Response.json({
    instagramPosts: instagramResult.posts,
    facebookPosts: facebookResult.posts,
    errors: [instagramResult.error, facebookResult.error].filter(Boolean),
  });
}
