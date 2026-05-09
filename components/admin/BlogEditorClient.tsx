'use client';

import React, { useState, useRef } from 'react';

import { useRouter } from 'next/navigation';

interface Props {
  initial?: any;
}

export default function BlogEditorClient({ initial = {} }: Props) {
  const [form, setForm] = useState<any>({
    _id: initial._id || undefined,
    title: initial.title || '',
    slug: initial.slug || '',
    excerpt: initial.excerpt || '',
    author: initial.author || '',
    category: initial.category || '',
    readTime: initial.readTime || '',
    thumbnail: initial.thumbnail || '',
    metaTitle: initial.metaTitle || '',
    metaDescription: initial.metaDescription || '',
    canonical: initial.canonical || '',
    isDraft: initial.isDraft ?? true,
    contentHTML: initial.contentHTML || '<div className="prose">Start writing HTML here</div>',
  });

  const previewRef = useRef<HTMLDivElement | null>(null);

  function updateField(key: string, value: any) {
    setForm((s: any) => ({ ...s, [key]: value }));
  }

  function insertSnippet(snippet: string) {
    updateField('contentHTML', form.contentHTML + snippet);
  }

  const router = useRouter();

  async function handleSave() {
    try {
      const method = form._id ? 'PATCH' : 'POST';
      const url = form._id ? `/api/admin/blogs/${form._id}` : '/api/admin/blogs';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.ok) {
        router.push('/admin/blogs');
      } else {
        alert('Save failed');
      }
    } catch (e) {
      console.error(e);
      alert('Save failed');
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        {/* Title and Slug */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Post Title *</label>
          <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all" placeholder="Enter blog title" value={form.title} onChange={(e) => updateField('title', e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">URL Slug *</label>
          <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all" placeholder="url-friendly-slug" value={form.slug} onChange={(e) => updateField('slug', e.target.value)} />
        </div>

        {/* Author and Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Author</label>
            <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all" placeholder="Author name" value={form.author} onChange={(e) => updateField('author', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
            <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all" placeholder="e.g., SEO" value={form.category} onChange={(e) => updateField('category', e.target.value)} />
          </div>
        </div>

        {/* Read Time and Thumbnail */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Read Time</label>
            <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all" placeholder="e.g., 5 min" value={form.readTime} onChange={(e) => updateField('readTime', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Thumbnail Path</label>
            <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all" placeholder="/path/to/image.jpg" value={form.thumbnail} onChange={(e) => updateField('thumbnail', e.target.value)} />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Excerpt</label>
          <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all h-20 resize-none" placeholder="Short description of your post" value={form.excerpt} onChange={(e) => updateField('excerpt', e.target.value)} />
        </div>

        {/* SEO */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent-from" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            SEO Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Meta Title</label>
              <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all" placeholder="SEO title (60 chars)" value={form.metaTitle} onChange={(e) => updateField('metaTitle', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Meta Description</label>
              <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all" placeholder="SEO description (160 chars)" value={form.metaDescription} onChange={(e) => updateField('metaDescription', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Canonical URL</label>
              <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all" placeholder="https://alviondigital.in/..." value={form.canonical} onChange={(e) => updateField('canonical', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Publish Status */}
        <div className="border-t border-gray-200 pt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative inline-flex">
              <input type="checkbox" checked={!form.isDraft} onChange={(e) => updateField('isDraft', !e.target.checked)} className="sr-only" />
              <div className={`w-12 h-6 rounded-full transition-all ${!form.isDraft ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${!form.isDraft ? 'translate-x-6' : ''}`}></div>
            </div>
            <span className="font-semibold text-gray-900">{!form.isDraft ? '✓ Published' : '⊙ Draft'}</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button className="flex-1 px-6 py-3 bg-linear-to-r from-accent-from to-accent-to text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-accent-from/30 transition-all duration-300 hover:-translate-y-0.5" onClick={handleSave}>Save Post</button>
        </div>
      </div>

      {/* Right Column: Content Editor and Preview */}
      <div className="space-y-6">
        {/* Content Editor */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Content (HTML + Tailwind Classes) *</label>
          <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all h-64 resize-none font-mono text-sm" value={form.contentHTML} onChange={(e) => updateField('contentHTML', e.target.value)} />
          <div className="flex gap-2 mt-3">
            <button type="button" onClick={() => insertSnippet('<h2 className="text-2xl font-bold mt-8 mb-4">Section Title</h2><p className="text-gray-700 leading-relaxed">Your paragraph here...</p>')} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium transition-colors">+ Section</button>
            <button type="button" onClick={() => insertSnippet('<img src="/Content Images/example.jpg" alt="description" class="w-full rounded-lg my-6"/>')} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium transition-colors">+ Image</button>
            <button type="button" onClick={() => insertSnippet('<ul class="space-y-2 ml-4"><li class="flex gap-2"><span class="text-accent-to">•</span> Point one</li><li class="flex gap-2"><span class="text-accent-to">•</span> Point two</li></ul>')} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium transition-colors">+ List</button>
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
            <svg className="w-5 h-5 text-accent-from" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Live Preview
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50 min-h-96 overflow-y-auto" ref={previewRef}>
            <div className="prose prose-sm sm:prose max-w-none" dangerouslySetInnerHTML={{ __html: form.contentHTML }} />
          </div>
        </div>
      </div>
    </div>
  );
}
