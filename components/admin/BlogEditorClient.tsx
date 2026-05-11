import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sanitizeBlogHtml } from '@/lib/html';
import { Blog } from '@/lib/models/Blog';
import type { MediaFile } from '@/lib/media';
import MediaLibraryModal from './MediaLibraryModal';

export default function BlogEditorClient({ initial }: { initial?: Partial<Blog> }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [author, setAuthor] = useState(initial?.author || '');
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaModalFor, setMediaModalFor] = useState<'thumbnail' | 'content' | null>(null);
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
        return data.file as MediaFile;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw error;
    } finally {
      setUploadingThumbnail(false);
    }
  }

  function handleMediaSelect(media: MediaFile) {
    if (mediaModalFor === 'thumbnail') {
      setThumbnail(media.publicUrl);
      setThumbnailPreview(media.publicUrl);
    } else if (mediaModalFor === 'content') {
      const imgTag = `<img src="${media.publicUrl}" alt="${media.originalName}" class="w-full rounded-lg my-4" />`;
      setContentHTML(contentHTML + '\n' + imgTag);
    }
    setMediaModalOpen(false);
  }

  async function onSave(e?: React.FormEvent) {
    e?.preventDefault();
    setSaving(true);
    try {
      const sanitized = sanitizeBlogHtml(contentHTML);
      await fetch('/api/admin/blogs', {
        method: 'POST',
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
      router.push('/admin/blogs');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button
          type="submit"
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm bg-linear-to-r from-accent-from to-accent-to text-white hover:opacity-90 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-from disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
        >
          {saving ? 'Saving...' : 'Save Post'}
        </button>
      </div>

      <form onSubmit={onSave} className="space-y-8">
        {/* Post Details */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-6 text-lg font-bold text-gray-900">Post Details</h3>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Post Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">URL Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-friendly-slug"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., SEO"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Read Time</label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g., 5 min"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Thumbnail URL / Upload</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://example.com/image.jpg or select from library"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMediaModalFor('thumbnail');
                      setMediaModalOpen(true);
                    }}
                    className="px-4 py-2 bg-accent-from text-white rounded-lg hover:opacity-90 cursor-pointer transition-all font-medium text-sm"
                  >
                    Library
                  </button>
                  <label className="px-4 py-2 bg-accent-from text-white rounded-lg hover:opacity-90 cursor-pointer transition-all font-medium text-sm">
                    Upload
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
                      onClick={() => {
                        setThumbnail('');
                        setThumbnailPreview(null);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer transition-all font-medium text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
                {(thumbnailPreview || thumbnail) && (
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 h-32 bg-gray-50">
                    <img
                      src={thumbnailPreview || thumbnail}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short description of your post"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-6 text-lg font-bold text-gray-900">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Meta Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="SEO title (60 chars)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Meta Description</label>
              <input
                type="text"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="SEO description (160 chars)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Canonical URL</label>
              <input
                type="text"
                value={canonical}
                onChange={(e) => setCanonical(e.target.value)}
                placeholder="https://alviondigital.in/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Publish Status */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative inline-flex">
              <input
                type="checkbox"
                checked={!isDraft}
                onChange={(e) => setIsDraft(!e.target.checked)}
                className="sr-only"
              />
              <div className={`w-12 h-6 rounded-full transition-all ${!isDraft ? 'bg-green-500' : 'bg-gray-300'}`} />
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all ${!isDraft ? 'translate-x-6' : ''}`}
              />
            </div>
            <span className="font-semibold text-gray-900">{!isDraft ? '✓ Published' : '⊙ Draft'}</span>
          </label>
        </div>

        {/* Content Editor */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Content</h3>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-900">HTML Content</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMediaModalFor('content');
                      setMediaModalOpen(true);
                    }}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 font-medium cursor-pointer transition-colors"
                  >
                    + From Library
                  </button>
                  <label className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 font-medium cursor-pointer transition-colors">
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
              <textarea
                value={contentHTML}
                onChange={(e) => setContentHTML(e.target.value)}
                placeholder="Paste or write raw HTML here. Inline styles allowed."
                rows={12}
                className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">You can use inline CSS in this editor.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Live Preview</label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50 h-96 overflow-y-auto">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: contentHTML }} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm bg-linear-to-r from-accent-from to-accent-to text-white hover:opacity-90 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-from disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
          >
            {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </form>

      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelect={handleMediaSelect}
        onUpload={handleThumbnailUpload}
      />
    </div>
  );
}
