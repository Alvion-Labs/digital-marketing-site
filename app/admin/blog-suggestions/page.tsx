'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type SuggestionStatus = 'new' | 'reviewed' | 'resolved';

type BlogSuggestion = {
  _id: string;
  blogId: string;
  blogSlug?: string;
  email: string;
  rating: number;
  suggestion?: string;
  status: SuggestionStatus;
  adminNotes?: string;
  createdAt: string;
};

const STATUS_OPTIONS: SuggestionStatus[] = ['new', 'reviewed', 'resolved'];

export default function AdminBlogSuggestionsPage() {
  const router = useRouter();
  const [items, setItems] = useState<BlogSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | SuggestionStatus>('all');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadSuggestions = async () => {
    const query = statusFilter === 'all' ? '' : `?status=${statusFilter}`;
    const res = await fetch(`/api/admin/blog-suggestions${query}`, { cache: 'no-store' });

    if (res.status === 401) {
      router.replace('/admin/login');
      return;
    }

    const json = await res.json();
    setItems(Array.isArray(json?.suggestions) ? json.suggestions : []);
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadSuggestions();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const avgRating = useMemo(() => {
    if (!items.length) return 0;
    return items.reduce((sum, item) => sum + (item.rating || 0), 0) / items.length;
  }, [items]);

  const updateStatus = async (id: string, status: SuggestionStatus, adminNotes: string) => {
    setNotice(null);
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/blog-suggestions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      });

      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to update suggestion');
      }

      await loadSuggestions();
      setNotice({ type: 'success', text: 'Suggestion updated.' });
    } catch {
      setNotice({ type: 'error', text: 'Failed to update suggestion. Please try again.' });
    } finally {
      setSavingId(null);
    }
  };

  const deleteSuggestion = async (id: string) => {
    if (!confirm('Delete this suggestion?')) return;

    setNotice(null);
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/blog-suggestions/${id}`, {
        method: 'DELETE',
      });

      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }

      if (!res.ok) throw new Error('Delete failed');
      await loadSuggestions();
      setNotice({ type: 'success', text: 'Suggestion deleted.' });
    } catch {
      setNotice({ type: 'error', text: 'Failed to delete suggestion.' });
    } finally {
      setSavingId(null);
    }
  };

  const getStatusTone = (status: SuggestionStatus) => {
    if (status === 'resolved') return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    if (status === 'reviewed') return 'bg-blue-50 text-blue-700 ring-blue-200';
    return 'bg-amber-50 text-amber-700 ring-amber-200';
  };

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold admin-heading-gradient">Blog Ratings & Suggestions</h2>
          <p className="text-gray-600 mt-1">Manage user ratings and feedback from blog pages</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-4 py-2 rounded-full bg-accent-from/10 text-accent-from text-sm font-semibold">
            Total: {loading ? '...' : items.length}
          </span>
          <span className="px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold">
            Avg Rating: {avgRating.toFixed(1)} / 5
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | SuggestionStatus)}
            className="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm font-medium"
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {notice && (
        <div
          className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-medium ${
            notice.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-gray-500">Loading suggestions...</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-600 font-medium">No suggestions found</p>
            <p className="text-sm text-gray-500 mt-1">New feedback will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item) => {
              const blogLink = item.blogSlug ? `/blog/${item.blogSlug}` : '#';
              return (
                <div key={item._id} className="p-5 md:p-6 hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200">
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-accent-from/10 px-3 py-1 text-xs font-semibold text-accent-to ring-1 ring-inset ring-accent-from/20">
                          {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusTone(item.status)}`}>
                          {item.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700">
                        Email: <span className="font-semibold">{item.email}</span>
                      </p>

                      <p className="text-sm text-gray-700 wrap-break-word">
                        Suggestion: {item.suggestion?.trim() ? item.suggestion : 'No written suggestion provided.'}
                      </p>

                      {item.blogSlug ? (
                        <Link
                          href={blogLink}
                          target="_blank"
                          className="inline-flex items-center text-sm font-semibold text-accent-to hover:text-accent-from"
                        >
                          View related blog →
                        </Link>
                      ) : (
                        <p className="text-xs text-gray-500">Related blog slug not found</p>
                      )}
                    </div>

                    <div className="min-w-65 w-full md:w-auto space-y-3">
                      <div className="flex items-center gap-2">
                        <select
                          defaultValue={item.status}
                          onChange={(e) => updateStatus(item._id, e.target.value as SuggestionStatus, item.adminNotes || '')}
                          className="px-3 py-2 rounded-full border border-gray-300 text-sm font-medium bg-white"
                          disabled={savingId === item._id}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => deleteSuggestion(item._id)}
                          disabled={savingId === item._id}
                          className="px-3 py-2 rounded-full border border-red-200 bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>

                      <textarea
                        defaultValue={item.adminNotes || ''}
                        placeholder="Admin notes"
                        rows={3}
                        className="w-full rounded-2xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent-from/40 focus:ring-4 focus:ring-accent-from/10"
                        onBlur={(e) => {
                          if ((item.adminNotes || '') !== e.target.value) {
                            updateStatus(item._id, item.status, e.target.value);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
