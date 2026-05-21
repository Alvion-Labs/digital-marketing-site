"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import BlogCard from './BlogCard';
import Button from '@/components/global/Button';
import type { BlogCardPost } from '@/lib/blogCard';

type Props = {
  posts: BlogCardPost[];
};

export default function BlogListingFiltersClient({ posts }: Props) {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category).filter((cat): cat is string => !!cat));
    return Array.from(cats).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    let result = posts;

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (!debounced.trim()) return result;
    const q = debounced.trim().toLowerCase();
    return result.filter((p) => {
      return (
        (p.title || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q)
      );
    });
  }, [debounced, posts, selectedCategory]);

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // short fade when results update
    setIsAnimating(true);
    const t = setTimeout(() => setIsAnimating(false), 220);
    return () => clearTimeout(t);
  }, [debounced]);

  return (
    <div>
      {/* Category filters - above input on mobile, below on sm+ */}
      <div className="mb-4 sm:mb-4 order-first sm:order-last flex flex-wrap gap-4 sm:gap-5">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition whitespace-nowrap ${
            selectedCategory === null
              ? 'bg-linear-to-r from-accent-from to-accent-to text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-linear-to-r from-accent-from to-accent-to text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-6 order-last sm:order-first">
        <label htmlFor="blog-search" className="sr-only">Search posts</label>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="relative w-full max-w-lg">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <input
              id="blog-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, category or excerpt"
              className="w-full rounded-full border border-gray-200 px-12 pr-14 py-3.5 text-sm sm:text-base shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
              aria-label="Search blog posts"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
              >
                <span aria-hidden className="text-base">×</span>
              </button>
            )}
          </div>

          <div className="text-xs sm:text-base font-medium text-gray-700 whitespace-nowrap">
            Showing {filtered.length} of {posts.length}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto max-w-xl px-4">
            <p className="text-2xl font-semibold text-gray-800">Sorry! no articles match your search.</p>
            <p className="mt-3 text-sm text-gray-600">Tell us what you’re looking for, and we’ll do our best to create it and notify you when it’s published.</p>
            <div className="mt-6 flex justify-center">
              <Button href="/#contact" variant="primary" size="md">
                Send Request
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 transition-opacity duration-300 ${isAnimating ? 'opacity-60' : 'opacity-100'}`}>
          {filtered.map((post) => (
            <div key={post.slug} className="transform transition-transform duration-300 hover:-translate-y-1">
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
