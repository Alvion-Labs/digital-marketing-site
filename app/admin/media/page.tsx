"use client";

import React, { useEffect, useState, useRef } from 'react';
import AdminAuthGate from '@/components/admin/AdminAuthGate';
import Button from '@/components/global/Button';
import ConfirmDialog from '@/components/global/ConfirmDialog';
import { ToastContainer, useToast } from '@/components/global/Toast';

interface MediaItem {
  _id?: string;
  filename: string;
  originalName: string;
  publicUrl: string;
  size: number;
  uploadedAt: string;
  usedBy?: Array<{ type: string; field: string; module: string }>;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(24);
  const [totalItems, setTotalItems] = useState(0);
  const [imageDimensions, setImageDimensions] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [deletingFilename, setDeletingFilename] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<MediaItem | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  async function load(nextPage = page) {
    setLoading(true);
    try {
      const skip = (nextPage - 1) * pageSize;
      const url = search 
        ? `/api/admin/media?q=${encodeURIComponent(search)}&limit=${pageSize}`
        : `/api/admin/media?limit=${pageSize}&skip=${skip}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.ok) {
        setItems(json.items || []);
        setTotalItems(json.total || (json.items || []).length);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPage(1);
    load(1);
  }, [search]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    addToast('Uploading media...', 'info', 1200);
    const fd = new FormData();
    fd.append('file', files[0]);
    try {
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.ok) {
        addToast('Media uploaded successfully', 'success');
        load();
      } else {
        addToast(json.error || 'Upload failed', 'error');
      }
    } catch (e) {
      console.error(e);
      addToast('Upload failed', 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function handleDelete(filename: string) {
    setDeletingFilename(filename);
    addToast('Deleting media...', 'info', 1200);
    try {
      const res = await fetch('/api/admin/media', { 
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ filename }) 
      });
      const json = await res.json();
      if (json.ok) {
        addToast('Media deleted successfully', 'success');
        load();
      } else {
        addToast(json.error || 'Delete failed', 'error');
      }
    } catch (e) {
      console.error(e);
      addToast('Delete failed', 'error');
    } finally {
      setDeletingFilename(null);
      setConfirmDelete(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <AdminAuthGate>
      <div className="space-y-6">
        <ConfirmDialog
          isOpen={confirmDelete !== null}
          title="Delete Media"
          message={`Are you sure you want to delete ${confirmDelete?.originalName}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isDangerous={true}
          isLoading={deletingFilename !== null}
          onConfirm={() => confirmDelete && handleDelete(confirmDelete.filename)}
          onCancel={() => setConfirmDelete(null)}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold admin-heading-gradient">Media Library</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all uploaded media assets</p>
          </div>
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
            <Button type="button" variant="primary" onClick={() => fileRef.current?.click()} disabled={uploading}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-from"
          />
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              title="Grid view"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              title="List view"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
              </svg>
            </button>
          </div>
          <Button type="button" variant="secondary" onClick={() => load(page)}>Refresh</Button>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {items.length} of {totalItems} files
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const next = Math.max(1, page - 1);
                setPage(next);
                load(next);
              }}
              disabled={page <= 1 || loading}
            >
              Prev
            </Button>
            <span className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-200">
              {page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const next = Math.min(totalPages, page + 1);
                setPage(next);
                load(next);
              }}
              disabled={page >= totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Media Display */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading media library...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600">No media files yet</p>
            <p className="text-sm text-gray-500">Upload your first image to get started</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.filename} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
                {/* Image Preview */}
                  <div className="relative h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.publicUrl}
                    alt={item.originalName}
                    className="max-h-full max-w-full object-contain"
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      setImageDimensions((prev) => ({
                        ...prev,
                        [item.filename]: `${img.naturalWidth} × ${img.naturalHeight}`,
                      }));
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center gap-2 justify-center opacity-0 group-hover:opacity-100">
                    <a
                      href={item.publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-all"
                      title="Open in new tab"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(item.publicUrl);
                        addToast('URL copied to clipboard', 'success', 2200);
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-all"
                      title="Copy URL"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Info */}
                <div className="p-3 space-y-2">
                  <p className="text-sm font-medium text-gray-900 truncate" title={item.originalName}>{item.originalName}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
                  <p className="text-xs text-gray-500">{imageDimensions[item.filename] || 'Image dimensions loading...'}</p>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(item)}
                    disabled={deletingFilename === item.filename}
                    className="w-full px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50/70 hover:bg-red-100 border border-red-200 rounded-full transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {deletingFilename === item.filename ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Size</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Uploaded</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Usage</th>
                  <th className="px-6 py-3 text-right font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.filename} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.publicUrl}
                          alt={item.originalName}
                          className="w-8 h-8 rounded object-cover"
                          onLoad={(e) => {
                            const img = e.currentTarget;
                            setImageDimensions((prev) => ({
                              ...prev,
                              [item.filename]: `${img.naturalWidth} × ${img.naturalHeight}`,
                            }));
                          }}
                        />
                        <span className="text-gray-900 font-medium truncate" title={item.originalName}>{item.originalName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{formatFileSize(item.size)}</td>
                    <td className="px-6 py-3 text-gray-600">{formatDate(item.uploadedAt)}</td>
                    <td className="px-6 py-3 text-gray-600">
                      {item.usedBy && item.usedBy.length > 0 ? (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {item.usedBy.length} reference{item.usedBy.length > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="text-gray-400">Unused</span>
                      )}
                      <div className="text-xs text-gray-500 mt-1">{imageDimensions[item.filename] || 'Dimensions loading...'}</div>
                    </td>
                    <td className="px-6 py-3 text-right space-x-2">
                      <a
                        href={item.publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-accent-from hover:underline text-sm font-medium"
                      >
                        Open
                      </a>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(item)}
                        disabled={deletingFilename === item.filename}
                        className="inline-flex items-center px-3 py-1.5 rounded-full border border-red-200 bg-red-50/70 text-red-600 hover:bg-red-100 text-xs font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {deletingFilename === item.filename ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </AdminAuthGate>
  );
}
