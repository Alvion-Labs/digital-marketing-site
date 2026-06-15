'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { sanitizeBlogHtml } from '@/lib/html';
import { Blog } from '@/lib/models/Blog';
import type { MediaFile } from '@/lib/media';
import MediaLibraryModal from './MediaLibraryModal';
import ConfirmDialog from '@/components/global/ConfirmDialog';
import Button from '@/components/global/Button';

interface TOCItem {
  title: string;
  anchor: string;
}

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
  const [tldr, setTldr] = useState((initial as any)?.tldr || '');
  const [isDraft, setIsDraft] = useState(initial?.isDraft ?? true);
  const [contentHTML, setContentHTML] = useState(initial?.contentHTML || '');
  const [tableOfContents, setTableOfContents] = useState<TOCItem[]>((initial as any)?.tableOfContents || []);
  const [tocCountInput, setTocCountInput] = useState<number>(Math.max(1, ((initial as any)?.tableOfContents || []).length || 1));
  const [conclusion, setConclusion] = useState((initial as any)?.conclusion || '');
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>((initial as any)?.faqs || []);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingContent, setUploadingContent] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaModalFor, setMediaModalFor] = useState<'thumbnail' | 'content' | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingThumbnail, setDeletingThumbnail] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [draggingDoc, setDraggingDoc] = useState(false);
  const [importingDoc, setImportingDoc] = useState(false);
  const [docImportStatus, setDocImportStatus] = useState<'idle' | 'importing' | 'imported' | 'error'>('idle');
  const [importedDocName, setImportedDocName] = useState<string | null>(null);
  const [docImportMessage, setDocImportMessage] = useState<string | null>(null);
  const editorFormRef = useRef<HTMLFormElement>(null);
  const contentPreviewRef = useRef<HTMLDivElement>(null);
  const contentFileInputRef = React.useRef<HTMLInputElement | null>(null);
  const docImportInputRef = React.useRef<HTMLInputElement | null>(null);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) {
      handleThumbnailUpload(e.dataTransfer.files[0]);
    }
  }

  async function uploadToMediaLibrary(file: File, field: string): Promise<MediaFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('usedBy', JSON.stringify({
      type: (initial as any)?._id || 'new-blog',
      field,
      module: 'blog'
    }));

    const res = await fetch('/api/admin/media', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.ok && data.file?.publicUrl) {
      return data.file as MediaFile;
    }
    throw new Error('Upload failed');
  }

  async function handleThumbnailUpload(file: File) {
    setUploadingThumbnail(true);
    try {
      const mediaFile = await uploadToMediaLibrary(file, 'thumbnail');
      setThumbnail(mediaFile.publicUrl);
      setThumbnailPreview(mediaFile.publicUrl);
      return mediaFile;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw error;
    } finally {
      setUploadingThumbnail(false);
    }
  }

  async function handleContentUpload(file: File) {
    setUploadingContent(true);
    try {
      const mediaFile = await uploadToMediaLibrary(file, 'content');
      // Only insert into contentHTML — never touches thumbnail state
      const imgTag = `<img src="${mediaFile.publicUrl}" alt="${mediaFile.originalName}" class="w-full rounded-lg my-4" />`;
      setContentHTML(prev => prev + '\n' + imgTag);
      return mediaFile;
    } catch (error) {
      console.error('Error uploading content image:', error);
      throw error;
    } finally {
      setUploadingContent(false);
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

  // Refetch blog data from server to sync state with saved data
  const refetchBlog = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.blog) {
          // Update all form fields with server data
          setTitle(json.blog.title || '');
          setSlug(json.blog.slug || '');
          setAuthor(json.blog.author || '');
          setCategory(json.blog.category || '');
          setReadTime(json.blog.readTime || '');
          setThumbnail(json.blog.thumbnail || '');
          setThumbnailPreview(json.blog.thumbnail || null);
          setExcerpt(json.blog.excerpt || '');
          setMetaTitle(json.blog.metaTitle || '');
          setMetaDescription(json.blog.metaDescription || '');
          setCanonical(json.blog.canonical || '');
          setTldr(json.blog.tldr || '');
          setIsDraft(json.blog.isDraft ?? true);
          setContentHTML(json.blog.contentHTML || '');
          setTableOfContents(json.blog.tableOfContents || []);
          setConclusion(json.blog.conclusion || '');
          setFaqs(json.blog.faqs || []);
        }
      }
    } catch (err) {
      console.error('Failed to refetch blog:', err);
    }
  }, []);

  async function onSave(e?: React.FormEvent) {
    e?.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      const sanitized = sanitizeBlogHtml(contentHTML);
      // conclusion should be plain text only; strip any HTML client-side
      const stripHtml = (s: string) => (s || '').replace(/<[^>]*>/g, '').trim();
      const formData = e?.currentTarget instanceof HTMLFormElement ? new FormData(e.currentTarget) : null;
      const conclusionValue = typeof formData?.get('conclusion') === 'string' ? String(formData.get('conclusion')) : conclusion;
      const plainConclusion = stripHtml(conclusionValue || '');
      const sanitizedFaqs = faqs.map((f) => ({
        question: stripHtml(f.question || ''),
        answer: sanitizeBlogHtml(f.answer || ''),
      }));
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
          conclusion: plainConclusion,
          tldr,
          faqs: sanitizedFaqs,
          tableOfContents,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        setSaveError(errText || 'Save failed');
        console.error('Save failed:', errText);
        return;
      }

      const json = await response.json();

      // Stay on the editor page and refetch saved data when editing
      if (isEditing) {
        await refetchBlog(blogId);
      } else {
        // New blog created — refetch with the new server ID to switch to edit mode
        if (json.blog?._id) {
          // Update the editor state with server data
          const b = json.blog;
          setTitle(b.title || '');
          setSlug(b.slug || '');
          setAuthor(b.author || '');
          setCategory(b.category || '');
          setReadTime(b.readTime || '');
          setThumbnail(b.thumbnail || '');
          setThumbnailPreview(b.thumbnail || null);
          setExcerpt(b.excerpt || '');
          setMetaTitle(b.metaTitle || '');
          setMetaDescription(b.metaDescription || '');
          setCanonical(b.canonical || '');
          setTldr(b.tldr || '');
          setIsDraft(b.isDraft ?? true);
          setContentHTML(b.contentHTML || '');
          setTableOfContents(b.tableOfContents || []);
          setConclusion(b.conclusion || '');
          setFaqs(b.faqs || []);
          
          // Update the URL to edit mode without navigation
          router.replace(`/admin/blogs/${b._id}/edit`);
        }
      }

      setSaveSuccess(true);
      // Clear success indicator after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError('An unexpected error occurred');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDocImport(file: File) {
    setImportingDoc(true);
    setDocImportStatus('importing');
    setImportedDocName(file.name || 'document.docx');
    setDocImportMessage(`Importing ${file.name || 'document.docx'}...`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/blogs/import-doc', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data?.ok || !data?.parsed) {
        throw new Error(data?.error || 'Failed to import document');
      }

      const parsed = data.parsed as {
        title: string;
        slug: string;
        excerpt: string;
        metaTitle: string;
        metaDescription: string;
        author: string;
        category: string;
        readTime: string;
        canonical: string;
        thumbnail: string;
        tldr: string;
        conclusion: string;
        faqs: Array<{ question: string; answer: string }>;
        tableOfContents: Array<{ title: string; anchor: string }>;
        contentHTML: string;
      };

      // Fill metadata fields from document
      if (parsed.title) setTitle(parsed.title);
      if (parsed.slug) setSlug(parsed.slug);
      if (parsed.excerpt) setExcerpt(parsed.excerpt);
      if (parsed.metaTitle) setMetaTitle(parsed.metaTitle);
      if (parsed.metaDescription) setMetaDescription(parsed.metaDescription);
      if (parsed.author) setAuthor(parsed.author);
      if (parsed.category) setCategory(parsed.category);
      if (parsed.readTime) setReadTime(parsed.readTime);
      if (parsed.canonical) setCanonical(parsed.canonical);
      if (parsed.thumbnail) {
        setThumbnail(parsed.thumbnail);
        setThumbnailPreview(parsed.thumbnail);
      }
      if (parsed.tldr) setTldr(parsed.tldr);
      if (parsed.conclusion) setConclusion(parsed.conclusion);
      if (Array.isArray(parsed.faqs) && parsed.faqs.length > 0) setFaqs(parsed.faqs);
      if (Array.isArray(parsed.tableOfContents)) {
        setTableOfContents(parsed.tableOfContents);
        setTocCountInput(parsed.tableOfContents.length);
      }

      // Intentionally keep content editor manual unless user chooses otherwise
      setDocImportStatus('imported');
      setDocImportMessage(`Imported ${file.name || 'document.docx'} successfully. Please review auto-filled fields before saving.`);
    } catch (error) {
      setDocImportStatus('error');
      setDocImportMessage(error instanceof Error ? error.message : 'Failed to import document');
    } finally {
      setImportingDoc(false);
      if (docImportInputRef.current) docImportInputRef.current.value = '';
    }
  }

  function clearDocImportState() {
    setImportedDocName(null);
    setDocImportStatus('idle');
    setDocImportMessage(null);
    if (docImportInputRef.current) docImportInputRef.current.value = '';
  }

  function handleDocDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDraggingDoc(true);
  }

  function handleDocDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDraggingDoc(false);
  }

  function handleDocDrop(e: React.DragEvent) {
    e.preventDefault();
    setDraggingDoc(false);

    const file = e.dataTransfer?.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.docx')) {
      setDocImportStatus('error');
      setDocImportMessage('Only .docx files are supported. Export your Google Doc as .docx first.');
      return;
    }

    handleDocImport(file);
  }

  function applyTOCCount() {
    const target = Math.max(0, Math.min(100, Number(tocCountInput) || 0));
    setTableOfContents((prev) => {
      if (target === prev.length) return prev;
      if (target < prev.length) return prev.slice(0, target);

      const toAdd = target - prev.length;
      return [...prev, ...Array.from({ length: toAdd }, () => ({ title: '', anchor: '' }))];
    });
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      {/* Header - Refined Toolbar */}
      <div className="sticky top-0 z-40 border-b border-gray-200/60 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="text-gray-400">/</span>
                <span>blogs</span>
                {isEditing && (
                  <>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600 font-medium truncate max-w-50">{title || slug || 'untitled'}</span>
                  </>
                )}
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-linear-to-r from-accent-from to-accent-to bg-clip-text text-transparent truncate">
                {isEditing ? (title || 'Untitled') : 'New Blog Post'}
              </h1>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Draft / Published Toggle */}
              <label className="relative inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200/80 cursor-pointer hover:bg-gray-100/80 transition-colors group">
                <div className="relative inline-flex">
                  <input
                    type="checkbox"
                    checked={!isDraft}
                    onChange={(e) => setIsDraft(!e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-all duration-200 ${!isDraft ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-200 shadow-sm ${!isDraft ? 'translate-x-4' : ''}`}
                  />
                </div>
                <span className={`text-xs font-semibold tracking-wide ${!isDraft ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {!isDraft ? 'Published' : 'Draft'}
                </span>
              </label>

              {/* Preview Toggle (desktop) */}
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant={showPreview ? 'outline' : 'secondary'}
                size="md"
                className="hidden lg:inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {showPreview ? 'Hide' : 'Preview'}
              </Button>

              {/* Divider */}
              <div className="hidden sm:block w-px h-7 bg-gray-200" />

              {/* Success indicator */}
              {saveSuccess && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold animate-fade-in">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Saved
                </div>
              )}

              {/* Save / Publish Button */}
              <Button
                type="button"
                onClick={() => editorFormRef.current?.requestSubmit()}
                disabled={saving}
                variant="primary"
                size="md"
                className="group relative overflow-hidden active:scale-[0.97]"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-600 bg-linear-to-r from-transparent via-white/20 to-transparent" />
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="relative z-10">Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="relative z-10">{isEditing ? 'Update' : 'Publish'}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form ref={editorFormRef} onSubmit={onSave} className="grid grid-cols-1 gap-8">
          {/* Main Column */}
          <div className="space-y-6">
            {/* Thumbnail Card - Enhanced UI */}
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
              <div className="p-6">
                {/* Preview Area */}
                {(thumbnailPreview || thumbnail) ? (
                  <div className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm mb-4">
                    <div className="aspect-video bg-linear-to-br from-gray-100 to-gray-50 relative">
                      {uploadingThumbnail && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                          <div className="flex flex-col items-center gap-2">
                            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-white text-sm font-medium">Uploading...</span>
                          </div>
                        </div>
                      )}
                      <img
                        src={thumbnailPreview || thumbnail}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                      {/* Hover overlay with actions */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                        <Button
                          onClick={() => {
                            setMediaModalFor('thumbnail');
                            setMediaModalOpen(true);
                          }}
                          variant="secondary"
                          size="sm"
                          className="px-4 py-2 transform scale-90 group-hover:scale-100 transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a4 4 0 014-4h8a4 4 0 014 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                          </svg>
                          Change
                        </Button>
                        <Button
                          onClick={handleDeleteThumbnailClick}
                          variant="danger"
                          size="sm"
                          className="px-4 py-2 transform scale-90 group-hover:scale-100 transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </Button>
                      </div>
                    </div>
                    {/* Image info bar */}
                    <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Thumbnail selected
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="text-accent-from font-medium">Active</span>
                    </div>
                  </div>
                ) : (
                  /* Empty state - click opens library, drag to upload */
                  <div 
                    className="mb-4"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Button
                      onClick={() => {
                        setMediaModalFor('thumbnail');
                        setMediaModalOpen(true);
                      }}
                      variant="secondary"
                      size="lg"
                      className={`relative flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-xl ${
                        dragging
                          ? 'border-accent-from bg-accent-from/5 scale-[1.01]'
                          : 'border-gray-200 bg-gray-50/50 hover:border-accent-from/40 hover:bg-accent-from/5'
                      }`}
                    >
                      {uploadingThumbnail ? (
                        <div className="flex flex-col items-center gap-3 py-8">
                          <svg className="animate-spin h-10 w-10 text-accent-from" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="text-sm font-medium text-gray-600">Uploading thumbnail...</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col items-center gap-3 py-8">
                            <div className="w-14 h-14 rounded-full bg-linear-to-br from-purple-100 to-purple-50 flex items-center justify-center shadow-sm">
                              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-semibold text-gray-700">
                                <span className="text-accent-from">Browse library</span> or drag to upload
                              </p>
                              <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 10MB</p>
                            </div>
                          </div>
                        </>
                      )}
                    </Button>
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
                <div
                  className={`rounded-xl border p-4 transition-all ${draggingDoc ? 'border-accent-from bg-accent-from/10 ring-2 ring-accent-from/30' : 'border-blue-200 bg-blue-50/70'}`}
                  onDragOver={handleDocDragOver}
                  onDragLeave={handleDocDragLeave}
                  onDrop={handleDocDrop}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Import Google Doc (.docx)</p>
                      <p className="text-xs text-blue-700">Auto-fills metadata, TOC, and labeled fields. Content stays manual as requested. You can also drag and drop a `.docx` here.</p>
                      <p className="mt-1 text-[11px] text-blue-700">Features: auto-fill title/SEO/TOC/FAQs, keep content editor manual, and quick re-import.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        ref={docImportInputRef}
                        type="file"
                        accept=".docx"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleDocImport(f);
                        }}
                        className="hidden"
                      />
                      <Button
                        onClick={() => docImportInputRef.current?.click()}
                        variant="secondary"
                        size="sm"
                        disabled={importingDoc}
                      >
                        {importingDoc ? 'Importing…' : importedDocName ? 'Import Again' : 'Import .docx'}
                      </Button>
                      {importedDocName && (
                        <Button
                          onClick={clearDocImportState}
                          variant="danger"
                          size="sm"
                          disabled={importingDoc}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                  {importedDocName && (
                    <div className="mt-3 rounded-lg border border-blue-200 bg-white/90 px-3 py-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 font-semibold">
                        {docImportStatus === 'importing' ? 'Importing' : docImportStatus === 'imported' ? 'Imported' : docImportStatus === 'error' ? 'Import Error' : 'Ready'}
                      </span>
                      <span className="text-gray-700">File:</span>
                      <span className="font-medium text-gray-900 break-all">{importedDocName}</span>
                      {docImportStatus === 'imported' && (
                        <span className="text-emerald-700 font-medium">Please review fields before saving.</span>
                      )}
                    </div>
                  )}
                  {docImportMessage && (
                    <p className={`mt-3 text-xs ${docImportStatus === 'error' ? 'text-red-700' : 'text-blue-800'}`}>{docImportMessage}</p>
                  )}
                  <div className="mt-3 rounded-lg border border-blue-200 bg-white/80 p-3">
                    <p className="text-[11px] font-semibold text-blue-900">Recommended DOC format (in order):</p>
                    <p className="mt-1 text-[11px] text-blue-800 leading-5">
                      <span className="font-medium">Title:</span> ...<br />
                      <span className="font-medium">Author:</span> ...<br />
                      <span className="font-medium">Category:</span> ...<br />
                      <span className="font-medium">ReadTime:</span> ...<br />
                      <span className="font-medium">Canonical:</span> ...<br />
                      <span className="font-medium">Thumbnail:</span> ...<br />
                      <span className="font-medium">Excerpt:</span> ...<br />
                      <span className="font-medium">MetaTitle:</span> ...<br />
                      <span className="font-medium">MetaDescription:</span> ...<br />
                      <span className="font-medium">TLDR:</span> ...<br />
                      <span className="font-medium">Conclusion:</span> ...<br />
                      <span className="font-medium">TOC:</span> Intro to SEO, On-Page SEO, Off-Page SEO<br />
                      <span className="font-medium">or TOC:</span><br />
                      1. Intro to SEO<br />
                      2. On-Page SEO<br />
                      3. Off-Page SEO<br />
                      <span className="font-medium">FAQs:</span><br />
                      Q: ...<br />
                      A: ...<br />
                      Q: ...<br />
                      A: ...<br />
                      <span className="font-medium">or FAQs:</span> What is SEO?, SEO is..., Why SEO?, Because...
                    </p>
                    <p className="mt-2 text-[11px] text-blue-700">Heading 2/3 in document body is now optional fallback for TOC if `TOC:` is not provided.</p>
                  </div>
                </div>

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
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">TL;DR <span className="text-gray-400 font-normal">(HTML supported)</span></label>
                  <textarea
                    value={tldr}
                    onChange={(e) => setTldr(e.target.value)}
                    placeholder="<strong>TL;DR:</strong> Write your HTML summary here..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all font-mono text-sm bg-gray-50"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">Supports inline HTML, bold, links, etc.</p>
                    <button
                      type="button"
                      onClick={() => {
                        const preview = document.getElementById('tldr-preview');
                        if (preview) {
                          preview.classList.remove('hidden');
                          preview.innerHTML = tldr || '<span class="text-gray-400">No content yet...</span>';
                        }
                      }}
                      className="text-xs text-accent-from font-medium hover:underline"
                    >
                      Preview
                    </button>
                  </div>
                  <div
                    id="tldr-preview"
                    className="mt-3 rounded-lg border border-dashed border-gray-200 bg-white p-3 text-sm leading-relaxed hidden"
                  />
                </div>
              </div>
            </div>

            {/* Table of Contents Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-6 py-5 border-b border-gray-100/50 bg-linear-to-r from-blue-50/50 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Table of Contents</h3>
                      <p className="text-xs text-gray-600">Add sections for readers to navigate</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1.5">
                      <label htmlFor="toc-count" className="text-xs font-medium text-gray-600 whitespace-nowrap">Total TOCs</label>
                      <input
                        id="toc-count"
                        type="number"
                        min={0}
                        max={100}
                        value={tocCountInput}
                        onChange={(e) => setTocCountInput(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                        className="w-16 rounded-md border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <Button
                      onClick={applyTOCCount}
                      variant="primary"
                      size="sm"
                      className="text-sm font-medium"
                    >
                      Apply
                    </Button>
                    <Button
                      onClick={() => {
                        setTableOfContents([...tableOfContents, { title: '', anchor: '' }]);
                        setTocCountInput(tableOfContents.length + 1);
                      }}
                      variant="secondary"
                      size="sm"
                      className="text-sm font-medium"
                    >
                      + Add Item
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-3">
                {tableOfContents.length === 0 ? (
                  <p className="text-sm text-gray-500">No TOC items yet. Click "Add Item" to get started.</p>
                ) : (
                  tableOfContents.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <input
                        type="text"
                        placeholder="Section title (e.g., What is SEO?)"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...tableOfContents];
                          updated[idx].title = e.target.value;
                          setTableOfContents(updated);
                        }}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Anchor (e.g., what-is-seo)"
                        value={item.anchor}
                        onChange={(e) => {
                          const updated = [...tableOfContents];
                          updated[idx].anchor = e.target.value;
                          setTableOfContents(updated);
                        }}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      />
                      <Button
                        onClick={() => {
                          const updated = tableOfContents.filter((_, i) => i !== idx);
                          setTableOfContents(updated);
                          setTocCountInput(updated.length);
                        }}
                        variant="danger"
                        size="sm"
                        className="text-sm"
                      >
                        Delete
                      </Button>
                    </div>
                  ))
                )}
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
                      <Button
                        onClick={() => {
                          setMediaModalFor('content');
                          setMediaModalOpen(true);
                        }}
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                      >
                        + Library
                      </Button>
                      <input
                        ref={contentFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleContentUpload(e.target.files[0])}
                        className="hidden"
                        disabled={uploadingContent}
                      />
                      <Button
                        onClick={() => contentFileInputRef.current?.click()}
                        variant="secondary"
                        size="sm"
                        className={`text-xs ${uploadingContent ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        {uploadingContent ? 'Uploading...' : '+ Upload'}
                      </Button>
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

            {/* Conclusion Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-6 py-5 border-b border-gray-100/50 bg-linear-to-r from-gray-50/50 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3v6h6v-6c0-1.657-1.343-3-3-3zM5 20h14" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Conclusion</h2>
                    <p className="text-xs text-gray-600">Add a short concluding paragraph — plain text only</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <textarea
                  name="conclusion"
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="Write a short conclusion (plain text)"
                  rows={4}
                  className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all bg-white"
                />
                <p className="text-xs text-gray-500 mt-2">This will be rendered before the FAQ section on the published post.</p>
              </div>
            </div>

            {/* FAQs Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-6 py-5 border-b border-gray-100/50 bg-linear-to-r from-gray-50/50 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">FAQs</h3>
                    <p className="text-xs text-gray-600">Add frequently asked questions for readers</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-3">
                {faqs.length === 0 ? (
                  <p className="text-sm text-gray-500">No FAQs yet. Click "Add FAQ" to get started.</p>
                ) : (
                  faqs.map((f, idx) => (
                    <div key={idx} className="space-y-2">
                      <input
                        type="text"
                        placeholder="Question"
                        value={f.question}
                        onChange={(e) => {
                          const updated = [...faqs];
                          updated[idx].question = e.target.value;
                          setFaqs(updated);
                        }}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                      <textarea
                        placeholder="Answer (HTML allowed)"
                        value={f.answer}
                        onChange={(e) => {
                          const updated = [...faqs];
                          updated[idx].answer = e.target.value;
                          setFaqs(updated);
                        }}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                          variant="danger"
                          size="sm"
                          className="rounded-full"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
                    variant="primary"
                    size="sm"
                    className="rounded-full"
                  >
                    + Add FAQ
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>

      {/* Media Library Modal - pass the correct upload handler based on context */}
      <MediaLibraryModal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelect={handleMediaSelect}
        onUpload={mediaModalFor === 'content' ? handleContentUpload : handleThumbnailUpload}
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

      {/* Save error bar */}
      {saveError && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-slide-up">
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-red-50 border border-red-200 shadow-lg">
            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-red-800 flex-1">{saveError}</p>
            <button
              onClick={() => setSaveError(null)}
              className="shrink-0 p-1 rounded-full hover:bg-red-100 transition-colors"
            >
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}