'use client';

import React, { useState, useEffect } from 'react';
import type { Media } from '@/lib/models/Media';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
  onUpload?: (file: File) => Promise<Media>;
}

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  onUpload,
}: MediaLibraryModalProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState('');
  const [tab, setTab] = useState<'gallery' | 'upload'>('gallery');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen && tab === 'gallery') {
      loadMedia();
    }
  }, [isOpen, tab]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Select Media</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setTab('gallery')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              tab === 'gallery'
                ? 'text-accent-from border-b-2 border-accent-from'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => setTab('upload')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              tab === 'upload'
                ? 'text-accent-from border-b-2 border-accent-from'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upload
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'gallery' ? (
            <>
              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search media..."
                  value={searching}
                  onChange={(e) => setSearching(e.target.value)}
                  onKeyUp={() => loadMedia()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from"
                />
              </div>

              {/* Gallery Grid */}
              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
              ) : media.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {searching ? 'No results found' : 'No media uploaded yet'}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {media.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelect(m);
                        onClose();
                      }}
                      className="relative group rounded-lg overflow-hidden border border-gray-200 hover:border-accent-from transition-all"
                    >
                      <img
                        src={m.publicUrl}
                        alt={m.originalName || 'Image'}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                        <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-2">
                        <p className="text-xs text-white truncate">{m.originalName}</p>
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
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                  dragging
                    ? 'border-accent-from bg-accent-from/5'
                    : 'border-gray-300 hover:border-accent-from'
                }`}
              >
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-gray-700 font-medium mb-2">Drag image here to upload</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="inline-flex items-center justify-center px-6 py-2 bg-linear-to-r from-accent-from to-accent-to text-white rounded-lg hover:opacity-90 cursor-pointer transition-all">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {uploading && <p className="text-sm text-gray-600 mt-4">Uploading...</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
