'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Container from '@/components/global/Container';
import Button from '@/components/global/Button';
import { HeartIcon } from '@/components/global/icons';
import { fetchSocialFeed, type SocialPost } from '@/lib/api';

function PostCard({ post }: { post: SocialPost }) {
  const truncated = post.caption.length > 100 ? post.caption.slice(0, 100) + '…' : post.caption;

  return (
    <div className="group rounded-xl overflow-hidden bg-gray-100 border border-gray-200 hover:border-accent-from/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.caption.slice(0, 60)}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
          <img 
            src={post.platform === 'instagram' ? '/logos/insta filled.svg' : '/logos/facebook filled.svg'}
            alt={post.platform}
            className="w-4 h-4"
          />
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{truncated}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1 text-red-400">
            <HeartIcon className="w-4 h-4" />
            <span>{post.likes.toLocaleString()}</span>
          </div>
          <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}

type Tab = 'instagram' | 'facebook';

export default function SocialGallery() {
  const [activeTab, setActiveTab] = useState<Tab>('instagram');
  const [instagramPosts, setInstagramPosts] = useState<SocialPost[]>([]);
  const [facebookPosts, setFacebookPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSocialFeed = async () => {
      try {
        setLoading(true);
        const feed = await fetchSocialFeed();
        if (!isMounted) return;

        setInstagramPosts(feed.instagramPosts);
        setFacebookPosts(feed.facebookPosts);
        setError(feed.errors.length > 0 ? feed.errors[0] : null);
      } catch (fetchError) {
        if (!isMounted) return;
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load social posts');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSocialFeed();

    return () => {
      isMounted = false;
    };
  }, []);

  const posts = activeTab === 'instagram' ? instagramPosts : facebookPosts;

  const skeletonCards = Array.from({ length: 3 }, (_, index) => index);

  return (
    <section id="gallery" className="py-24 bg-white">
      <Container>
        <div className="text-center mb-12">
          <span className="text-accent-to text-sm font-semibold uppercase tracking-widest">Social Feed</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mt-3 mb-5">
            Latest Posts
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Stay up to date with our latest content and marketing insights.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-10">
          {(['instagram', 'facebook'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-linear-to-r from-accent-from to-accent-to text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-100 text-gray-700 hover:text-black border border-gray-300'
              }`}
            >
              <img
                src={tab === 'instagram' ? '/logos/insta filled.svg' : '/logos/facebook filled.svg'}
                alt={tab}
                className="w-4 h-4"
              />
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {skeletonCards.map((card) => (
              <div key={card} className="h-105 rounded-xl bg-gray-100 border border-gray-200 animate-pulse">
                <div className="h-64 rounded-t-xl bg-white/5" />
                <div className="p-4 space-y-4">
                  <div className="h-4 w-4/5 rounded bg-white/5" />
                  <div className="h-4 w-3/5 rounded bg-white/5" />
                  <div className="h-4 w-1/3 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-10 text-center text-gray-600">
            No posts available yet. Once your Meta tokens and IDs are set, the latest posts will appear here.
          </div>
        )}

        <div className="mt-12 flex justify-end">
          <Button href="/#contact" variant="primary" className="px-8 py-3">
            Get Started
          </Button>
        </div>
      </Container>
    </section>
  );
}
