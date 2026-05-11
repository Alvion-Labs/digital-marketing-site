'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { sanitizeBlogHtml } from '@/lib/html';
import { Blog } from '@/lib/models/Blog';
import type { Media } from '@/lib/models/Media';
import MediaLibraryModal from './MediaLibraryModal';
import ConfirmDialog from '@/components/global/ConfirmDialog';

export default function BlogEditorImproved({ initial }: { initial?: Partial<Blog> }) {
  const router = useRouter();
  const blogId = (initial as any)?._id; // Get blog ID for updates
  const isEditing = !!blogId; // True if editing existing blog
  const [title, setTitle] = useState(initial?.title || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [author, setAuthor] = useState(initial?.author || '');
  const [category, setCategory] = useState(initial?.category || '');
  const [readTime, setReadTime] = useState(initial?.readTime || '');
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail || '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '');
  const [metaTitle, setMetaTitle] = useState(initial?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initial?.metaDescription || '');
  const [canonical, setCanonical] = useState(initial?.canonical || '');
  const [isDraft, setIsDraft] = useState(initial?.isDraft ?? true);
  const [contentHTML, setContentHTML] = useState(initial?.contentHTML || '');
  const [saving, setSaving] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaModalFor, setMediaModalFor] = useState<'thumbnail' | 'content' | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingThumbnail, setDeletingThumbnail] = useState(false);
  const contentPreviewRef = useRef<HTMLDivElement>(null);

  async function handleThumbnailUpload(file: File) {
    setUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('usedBy', JSON.stringify({
        type: (initial as any)?._id || 'new-blog',
        field: 'thumbnail',
        module: 'blog'
      }));

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.ok && data.file?.publicUrl) {
        setThumbnail(data.file.publicUrl);
        setThumbnailPreview(data.file.publicUrl);
        return data.file as Media;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw error;
    } finally {
      setUploadingThumbnail(false);
    }
  }

  function handleMediaSelect(media: Media) {
    if (mediaModalFor === 'thumbnail') {
      setThumbnail(media.publicUrl);
      setThumbnailPreview(media.publicUrl);
    } else if (mediaModalFor === 'content') {
      const imgTag = `<img src="${media.publicUrl}" alt="${media.originalName}" class="w-full rounded-lg my-4" />`;
      setContentHTML(contentHTML + '\n' + imgTag);
    }
    setMediaModalOpen(false);
  }

  async function confirmDeleteThumbnail() {
    setDeletingThumbnail(true);
    try {
      // Unlink thumbnail from this blog (media stays in library)
      // File remains in media library for other use or manual deletion
      setThumbnail('');
      setThumbnailPreview(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error unlinking thumbnail:', error);
    } finally {
      setDeletingThumbnail(false);
    }
  }

  function handleDeleteThumbnailClick() {
    setShowDeleteConfirm(true);
  }

  async function onSave(e?: React.FormEvent) {
    e?.preventDefault();
    setSaving(true);
    try {
      const sanitized = sanitizeBlogHtml(contentHTML);
      const method = isEditing ? 'PATCH' : 'POST';
      const url = isEditing ? `/api/admin/blogs/${blogId}` : '/api/admin/blogs';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          author,
          category,
          readTime,
          thumbnail,
          excerpt,
          metaTitle,
          metaDescription,
          canonical,
          isDraft,
          contentHTML: sanitized,
        }),
      });

      if (!response.ok) {
        console.error('Save failed:', await response.text());
        return;
      }

      router.push('/admin/blogs');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-gray-200/50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-accent-from to-accent-to bg-clip-text text-transparent">
                {initial?.title ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {initial?.title ? `Last modified at ${new Date().toLocaleDateString()}` : 'Share your insights with the world'}
              </p>
            </div>
            <div className="flex gap-3">
              <label className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-white border border-gray-200 cursor-pointer">
                <div className="relative inline-flex">
                  <input
                    type="checkbox"
                    checked={!isDraft}
                    onChange={(e) => setIsDraft(!e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-7 rounded-full transition-all ${!isDraft ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${!isDraft ? 'translate-x-5' : ''}`}
                  />
                </div>
                <span className={`text-sm font-semibold ${!isDraft ? 'text-green-700' : 'text-yellow-700'}`}>
                  {!isDraft ? '✓ Published' : '⊙ Draft'}
                </span>
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="hidden lg:inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
              <button
                type="submit"
                onClick={onSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm bg-linear-to-r from-accent-from to-accent-to text-white hover:opacity-90 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-from disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {saving ? 'Saving...' : 'Save Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={onSave} className="grid grid-cols-1 gap-8">
          {/* Main Column */}
          <div className="space-y-6">
            {/* Thumbnail Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-6 py-5 border-b border-gray-100/50 bg-linear-to-r from-gray-50/50 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Thumbnail</h2>
                    <p className="text-xs text-gray-600">Featured image for this post</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMediaModalFor('thumbnail');
                      setMediaModalOpen(true);
                    }}
                    className="flex-1 px-4 py-2.5 bg-linear-to-r from-accent-from to-accent-to text-white rounded-lg hover:opacity-90 transition-all font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a4 4 0 014-4h8a4 4 0 014 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                    </svg>
                    From Library
                  </button>
                  <label className="flex-1 px-4 py-2.5 bg-white border-2 border-accent-from text-accent-from rounded-lg hover:bg-accent-from/5 transition-all font-medium text-sm flex items-center justify-center gap-2 cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Upload New
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleThumbnailUpload(e.target.files[0])}
                      className="hidden"
                      disabled={uploadingThumbnail}
                    />
                  </label>
                  {thumbnail && (
                    <button
                      type="button"
                      onClick={handleDeleteThumbnailClick}
                      className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium text-sm flex items-center justify-center"
                      title="Delete thumbnail"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                {(thumbnailPreview || thumbnail) && (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 h-48 bg-linear-to-br from-gray-100 to-gray-50 shadow-sm">
                    <img
                      src={thumbnailPreview || thumbnail}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Post Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-6 py-5 border-b border-gray-100/50 bg-linear-to-r from-gray-50/50 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Post Details</h2>
                    <p className="text-xs text-gray-600">Title, slug, and basic information</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Post Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter an engaging title"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">URL Slug *</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="url-friendly-slug"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all font-mono text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Author</label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Author name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g., SEO, Content"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Read Time</label>
                    <input
                      type="text"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      placeholder="e.g., 5 min"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Excerpt</label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Short summary for listings (SEO friendly)"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all resize-none bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-2">{excerpt.length}/160 characters</p>
                </div>
              </div>
            </div>

            {/* SEO Settings Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-6 py-5 border-b border-gray-100/50 bg-linear-to-r from-gray-50/50 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">SEO Settings</h3>
                    <p className="text-xs text-gray-600">Search engine optimization</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="60 characters max"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all text-sm bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">{metaTitle.length}/60</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Meta Description</label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="160 characters max"
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all text-sm resize-none bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">{metaDescription.length}/160</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Canonical URL</label>
                  <input
                    type="text"
                    value={canonical}
                    onChange={(e) => setCanonical(e.target.value)}
                    placeholder="https://alviondigital.in/..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all text-xs font-mono bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Content Editor Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-6 py-5 border-b border-gray-100/50 bg-linear-to-r from-gray-50/50 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-green-100 to-green-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Content</h2>
                    <p className="text-xs text-gray-600">Write your article with HTML and inline CSS</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-gray-900">HTML Content</label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMediaModalFor('content');
                        setMediaModalOpen(true);
                      }}
                      className="text-xs px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-full font-medium hover:bg-blue-100 transition-all"
                    >
                      + Library
                    </button>
                    <label className="text-xs px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-full font-medium hover:bg-blue-100 transition-all cursor-pointer">
                      + Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const imgTag = `<img src="${reader.result}" alt="description" class="w-full rounded-lg my-4" />`;
                              setContentHTML(contentHTML + '\n' + imgTag);
                            };
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <div className={`grid gap-4 ${showPreview ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  <div>
                    <textarea
                      value={contentHTML}
                      onChange={(e) => setContentHTML(e.target.value)}
                      placeholder="Paste or write raw HTML here. Inline styles allowed."
                      rows={showPreview ? 16 : 20}
                      className="w-full p-4 border border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-3">You can use inline CSS, HTML elements, and classes in this editor</p>
                  </div>
                  {showPreview && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Live Content Preview</label>
                        <div
                          ref={contentPreviewRef}
                          className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 h-80 overflow-y-auto"
                        >
                          <div className="blog-content bg-white p-4 rounded-lg shadow-sm border border-gray-100 max-w-none" dangerouslySetInnerHTML={{ __html: contentHTML || '<p className="text-gray-400">No content yet...</p>' }} />
                        </div>
                      </div>
                      {thumbnail && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-3">Thumbnail Preview</label>
                          <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-gray-200 h-48 bg-linear-to-br from-gray-100 to-gray-50">
                            <img
                              src={thumbnail}
                              alt="Thumbnail preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelect={handleMediaSelect}
        onUpload={handleThumbnailUpload}
      />

      {/* Delete Thumbnail Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Unlink Thumbnail"
        message="Remove this thumbnail from the blog? It will remain in the media library and can be reused on other blogs."
        confirmText="Unlink"
        cancelText="Keep It"
        isDangerous={true}
        onConfirm={confirmDeleteThumbnail}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={deletingThumbnail}
      />
    </div>
  );
}
