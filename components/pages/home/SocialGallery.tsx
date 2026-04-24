'use client';

import { useState } from 'react';
import Image from 'next/image';
import Container from '@/components/global/Container';
import { mockInstagramPosts, mockFacebookPosts, type SocialPost } from '@/lib/api';

function InstagramIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  );
}

function PostCard({ post }: { post: SocialPost }) {
  const truncated = post.caption.length > 100 ? post.caption.slice(0, 100) + '…' : post.caption;

  return (
    <div className="group rounded-2xl overflow-hidden bg-[#0d2d47] border border-white/5 hover:border-[#1E6BFF]/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.caption.slice(0, 60)}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
          {post.platform === 'instagram' ? <InstagramIcon /> : <FacebookIcon />}
        </div>
      </div>
      <div className="p-4">
        <p className="text-slate-300 text-sm leading-relaxed mb-3">{truncated}</p>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 text-red-400">
            <HeartIcon />
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

  const posts = activeTab === 'instagram' ? mockInstagramPosts : mockFacebookPosts;

  return (
    <section id="gallery" className="py-24 bg-primary">
      <Container>
        <div className="text-center mb-12">
          <span className="text-[#00A3FF] text-sm font-semibold uppercase tracking-widest">Social Feed</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-3 mb-5">
            Latest Posts
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
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
                  ? 'bg-gradient-to-r from-[#1E6BFF] to-[#00A3FF] text-white shadow-lg shadow-blue-500/25'
                  : 'bg-[#0d2d47] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {tab === 'instagram' ? <InstagramIcon /> : <FacebookIcon />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
