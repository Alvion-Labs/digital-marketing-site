'use client';

import React, { useState, useRef } from 'react';

import { useRouter } from 'next/navigation';
import Button from '@/components/global/Button';
import { useToast, ToastContainer } from '@/components/global/Toast';

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

  const { toasts, addToast, removeToast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  function updateField(key: string, value: any) {
    setForm((s: any) => ({ ...s, [key]: value }));
  }

  function insertSnippet(snippet: string) {
    updateField('contentHTML', form.contentHTML + snippet);
  }

  async function handleSave() {
    setIsSaving(true);
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
        const actionType = form._id ? 'updated' : 'created';
        addToast(
          `Blog post ${actionType} successfully! Redirecting...`,
          'success',
          2000
        );
        setTimeout(() => router.push('/admin/blogs'), 1500);
      } else {
        addToast(json.error || 'Failed to save blog post. Please try again.', 'error', 5000);
      }
    } catch (e) {
      console.error(e);
      addToast('An error occurred while saving. Please try again.', 'error', 5000);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="flex justify-end">
        <Button type="button" variant="primary" onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto px-8 py-4 rounded-full text-sm">
          {isSaving ? 'Saving...' : 'Save Post'}
        </Button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <h3 className="text-base font-bold text-gray-900">Post Details</h3>
          <span className="text-sm text-gray-500">Settings and SEO</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Post Title *</label>
              <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all bg-white" placeholder="Enter blog title" value={form.title} onChange={(e) => updateField('title', e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">URL Slug *</label>
              <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all bg-white" placeholder="url-friendly-slug" value={form.slug} onChange={(e) => updateField('slug', e.target.value)} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Author</label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all bg-white" placeholder="Author name" value={form.author} onChange={(e) => updateField('author', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all bg-white" placeholder="e.g., SEO" value={form.category} onChange={(e) => updateField('category', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Read Time</label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all bg-white" placeholder="e.g., 5 min" value={form.readTime} onChange={(e) => updateField('readTime', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Thumbnail Path</label>
                <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all bg-white" placeholder="/path/to/image.jpg" value={form.thumbnail} onChange={(e) => updateField('thumbnail', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Excerpt</label>
              <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all h-28 resize-none bg-white" placeholder="Short description of your post" value={form.excerpt} onChange={(e) => updateField('excerpt', e.target.value)} />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent-from" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                SEO Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Meta Title</label>
                  <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all bg-white" placeholder="SEO title (60 chars)" value={form.metaTitle} onChange={(e) => updateField('metaTitle', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Meta Description</label>
                  <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all bg-white" placeholder="SEO description (160 chars)" value={form.metaDescription} onChange={(e) => updateField('metaDescription', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Canonical URL</label>
                  <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all bg-white" placeholder="https://alviondigital.in/..." value={form.canonical} onChange={(e) => updateField('canonical', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative inline-flex">
                  <input type="checkbox" checked={!form.isDraft} onChange={(e) => updateField('isDraft', !e.target.checked)} className="sr-only" />
                  <div className={`w-12 h-6 rounded-full transition-all ${!form.isDraft ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${!form.isDraft ? 'translate-x-6' : ''}`}></div>
                </div>
                <span className="font-semibold text-gray-900">{!form.isDraft ? '✓ Published' : '⊙ Draft'}</span>
              </label>
            </div>
          </div>
        </div>

      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <h3 className="text-base font-bold text-gray-900">Content Editor</h3>
          <span className="text-sm text-gray-500">Code input and live preview</span>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Content (HTML + Tailwind Classes) *</label>
            <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all h-136 resize-none font-mono text-sm bg-white" value={form.contentHTML} onChange={(e) => updateField('contentHTML', e.target.value)} />
            <div className="flex flex-wrap gap-2 mt-3">
              <button type="button" onClick={() => insertSnippet('<h2 className="text-2xl font-bold mt-8 mb-4">Section Title</h2><p className="text-gray-700 leading-relaxed">Your paragraph here...</p>')} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 font-medium transition-colors hover:cursor-pointer">+ Section</button>
              <button type="button" onClick={() => insertSnippet('<img src="/Content Images/example.jpg" alt="description" class="w-full rounded-lg my-6"/>')} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 font-medium transition-colors hover:cursor-pointer">+ Image</button>
              <button type="button" onClick={() => insertSnippet('<ul class="space-y-2 ml-4"><li class="flex gap-2"><span class="text-accent-to">•</span> Point one</li><li class="flex gap-2"><span class="text-accent-to">•</span> Point two</li></ul>')} className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 font-medium transition-colors hover:cursor-pointer">+ List</button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
              <svg className="w-5 h-5 text-accent-from" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Live Preview
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50 h-136 overflow-y-auto" ref={previewRef}>
              <div className="prose prose-sm sm:prose max-w-none" dangerouslySetInnerHTML={{ __html: form.contentHTML }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="button" variant="primary" onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto px-8 py-4 rounded-full text-sm">
          {isSaving ? 'Saving...' : 'Save Post'}
        </Button>
      </div>
    </div>
  );
}
