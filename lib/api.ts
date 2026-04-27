export interface SocialPost {
  id: string;
  imageUrl: string;
  caption: string;
  platform: 'instagram' | 'facebook';
  date: string;
  likes: number;
  link: string;
}

export interface SocialFeedResponse {
  instagramPosts: SocialPost[];
  facebookPosts: SocialPost[];
  errors: string[];
}

export async function fetchSocialFeed(): Promise<SocialFeedResponse> {
  const response = await fetch('/api/social', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load social feed (${response.status})`);
  }

  return response.json();
}
