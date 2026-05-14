'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/global/Button';

export default function AdminPrivacyPolicyPage() {
  const router = useRouter();
  const [contentHTML, setContentHTML] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactWebsite, setContactWebsite] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [intro, setIntro] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPolicy() {
      try {
        const response = await fetch('/api/admin/privacy-policy', { cache: 'no-store' });

        if (response.status === 401) {
          router.replace('/admin/login');
          return;
        }

        const json = await response.json();
        if (!cancelled) {
          setContentHTML(json?.policy?.contentHTML || '');
          setContactEmail(json?.policy?.contactEmail || '');
          setContactWebsite(json?.policy?.contactWebsite || '');
          setEffectiveDate(json?.policy?.effectiveDate || '');
          setIntro(json?.policy?.intro || '');
          setSavedAt(json?.policy?.updatedAt || null);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load privacy policy.');
          setLoading(false);
        }
      }
    }

    loadPolicy();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function onSave() {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/privacy-policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentHTML, contactEmail, contactWebsite, effectiveDate, intro }),
      });

      if (response.status === 401) {
        router.replace('/admin/login');
        return;
      }

      if (!response.ok) {
        setError('Failed to save privacy policy.');
        return;
      }

      const json = await response.json();
      // Update all fields from the saved response to keep UI in sync with DB
      setContentHTML(json?.policy?.contentHTML ?? '');
      setContactEmail(json?.policy?.contactEmail ?? '');
      setContactWebsite(json?.policy?.contactWebsite ?? '');
      setEffectiveDate(json?.policy?.effectiveDate ?? '');
      setIntro(json?.policy?.intro ?? '');
      setSavedAt(json?.policy?.updatedAt || new Date().toISOString());
    } catch {
      setError('Failed to save privacy policy.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-3xl font-bold admin-heading-gradient">Privacy Policy</h2>
          <p className="text-gray-600 mt-1">Edit and publish your site privacy policy content (accepts raw HTML).</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-sm text-gray-600">
            {savedAt ? `Last updated: ${new Date(savedAt).toLocaleString()}` : 'No saved version yet.'}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/privacy-policy"
              target="_blank"
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50"
            >
              View Live Page
            </Link>
            <Button onClick={onSave} disabled={saving || loading} variant="primary" size="md">
              {saving ? 'Saving...' : 'Save Privacy Policy'}
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">Loading…</div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Effective Date</label>
              <input
                type="text"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2 text-sm"
                placeholder="e.g. January 1, 2025"
              />
              <p className="mt-0.5 text-xs text-gray-400">Enter a date string to display as the policy effective date.</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Intro / Description</label>
              <textarea
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2 text-sm"
                placeholder="Brief description about this privacy policy..."
                rows={3}
              />
              <p className="mt-0.5 text-xs text-gray-400">This will appear in the hero section below the title.</p>
            </div>

            <label className="text-sm font-medium text-gray-700">Privacy Policy HTML</label>
            <textarea
              value={contentHTML}
              onChange={(e) => setContentHTML(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-3 font-mono text-sm text-gray-800"
              placeholder="Paste raw HTML for the privacy policy here"
              style={{ minHeight: 300 }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2 text-sm"
                  placeholder="privacy@yourdomain.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Contact Website (optional)</label>
                <input
                  type="url"
                  value={contactWebsite}
                  onChange={(e) => setContactWebsite(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2 text-sm"
                  placeholder="https://yourdomain.com/contact"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
