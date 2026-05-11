'use client';

import React, { useState, useEffect } from 'react';
import type { MediaFile } from '@/lib/media';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaFile) => void;
  onUpload?: (file: File) => Promise<MediaFile>;
}

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  onUpload,
}: MediaLibraryModalProps) {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState('');
  const [tab, setTab] = useState<'gallery' | 'upload'>('gallery');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && tab === 'gallery') {
      loadMedia();
    }
  }, [isOpen, tab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen && tab === 'gallery') loadMedia();
    }, 300);
    return () => clearTimeout(timer);
  }, [searching]);

  async function loadMedia() {
    setLoading(true);
    try {
      const query = searching ? `?q=${encodeURIComponent(searching)}` : '';
      const res = await fetch(`/api/admin/media${query}`);
      const data = await res.json();
      if (data.ok) {
        setMedia(data.items || []);
      }
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileSelect(file: File) {
    if (!onUpload) return;

    setUploading(true);
    try {
      const uploaded = await onUpload(file);
      onSelect(uploaded);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  }

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
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }

  function handleSelectClick(m: MediaFile) {
    setSelectedId(m._id || null);
    onSelect(m);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Select Media</h2>
            <p className="text-sm text-gray-500">Choose an image from your library or upload a new one</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-3 gap-1 shrink-0">
          <button
            onClick={() => setTab('gallery')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'gallery'
                ? 'bg-accent-from/10 text-accent-from shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Gallery
          </button>
          <button
            onClick={() => setTab('upload')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'upload'
                ? 'bg-accent-from/10 text-accent-from shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'gallery' ? (
            <>
              {/* Search bar */}
              <div className="relative mb-5">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search media by name or tag..."
                  value={searching}
                  onChange={(e) => setSearching(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent transition-all bg-gray-50 text-sm"
                />
                {searching && (
                  <button
                    onClick={() => setSearching('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Gallery Grid */}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : media.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">
                    {searching ? 'No matching images found' : 'No images uploaded yet'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1 mb-4">
                    {searching ? 'Try a different search term' : 'Upload images to get started'}
                  </p>
                  {searching ? (
                    <button
                      onClick={() => setSearching('')}
                      className="px-4 py-2 text-sm font-semibold text-accent-from border border-accent-from/30 rounded-lg hover:bg-accent-from/5 transition-all"
                    >
                      Clear search
                    </button>
                  ) : (
                    <button
                      onClick={() => setTab('upload')}
                      className="px-4 py-2 text-sm font-semibold text-white bg-accent-from rounded-lg hover:opacity-90 transition-all"
                    >
                      Upload an image
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {media.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectClick(m)}
                      className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        selectedId === m._id
                          ? 'border-accent-from shadow-lg shadow-accent-from/20'
                          : 'border-gray-200 hover:border-accent-from/50 hover:shadow-md'
                      }`}
                    >
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={m.publicUrl}
                          alt={m.originalName || 'Image'}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-end justify-start p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white font-medium bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                            Select
                          </span>
                        </div>
                      </div>
                      {/* Selection check */}
                      {selectedId === m._id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-accent-from rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                          </svg>
                        </div>
                      )}
                      {/* File name badge */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-xs text-white/90 truncate leading-tight">
                          {m.originalName || 'Untitled'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  dragging
                    ? 'border-accent-from bg-accent-from/5 scale-[1.01]'
                    : 'border-gray-200 hover:border-accent-from/40 hover:bg-accent-from/5'
                }`}
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <svg className="animate-spin h-12 w-12 text-accent-from" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div className="text-center">
                      <p className="text-gray-700 font-semibold">Uploading...</p>
                      <p className="text-sm text-gray-500 mt-1">Please wait while your image is being processed</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center shadow-sm mb-4">
                      <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-gray-700 font-semibold mb-1">
                      <span className="text-accent-from">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-500 mb-6">PNG, JPG, WebP — up to 10MB</p>
                    <label className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-accent-from to-accent-to text-white rounded-full hover:opacity-90 cursor-pointer transition-all shadow-lg shadow-accent-from/20 font-semibold text-sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between shrink-0 bg-gray-50/50">
          <span className="text-xs text-gray-500">
            {tab === 'gallery' ? `${media.length} image${media.length !== 1 ? 's' : ''} in library` : 'Supports PNG, JPG, WebP'}
          </span>
          <button
            onClick={onClose}
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-4 py-1.5 rounded-lg hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}