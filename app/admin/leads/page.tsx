'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LeadsTableClient from '@/components/admin/LeadsTableClient';
import { AdminPageTitleSkeleton, AdminTableSkeleton } from '@/components/admin/AdminSkeletons';

type Lead = {
  _id: string;
  name: string;
  email: string;
  message: string;
  status?: string;
  createdAt: string;
};

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadLeads() {
      try {
        const response = await fetch('/api/admin/leads', { cache: 'no-store' });

        if (response.status === 401) {
          router.replace('/admin/login');
          return;
        }

        const json = await response.json();
        if (!cancelled) {
          setLeads(Array.isArray(json.leads) ? json.leads : []);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadLeads();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // Calculate stats
  const stats = {
    total: leads.length,
    new: leads.filter((l) => (l.status || 'new') === 'new').length,
    inDiscussion: leads.filter((l) => l.status === 'in_discussion').length,
    converted: leads.filter((l) => l.status === 'converted').length,
  };

  // Apply filters
  const filteredLeads = leads.filter((lead) => {
    const matchesName =
      !filterName || lead.name.toLowerCase().includes(filterName.toLowerCase()) || lead.email.toLowerCase().includes(filterName.toLowerCase());

    const leadDate = new Date(lead.createdAt);
    const matchesDateFrom = !filterDateFrom || leadDate >= new Date(filterDateFrom);
    const matchesDateTo = !filterDateTo || leadDate <= new Date(filterDateTo + 'T23:59:59');

    return matchesName && matchesDateFrom && matchesDateTo;
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          {loading ? <AdminPageTitleSkeleton /> : <h1 className="text-3xl font-bold text-gray-950">Leads</h1>}
        </div>
        <p className="mt-2 text-sm text-gray-600">Track and manage all incoming leads from your contact forms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-linear-to-r from-accent-from/5 to-accent-to/5 border border-accent-from/10">
          <p className="text-xs text-gray-600 uppercase tracking-wide">Total Leads</p>
          <p className="text-3xl font-bold text-gray-950 mt-1">{loading ? '...' : stats.total}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <p className="text-xs text-slate-600 uppercase tracking-wide">New</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{loading ? '...' : stats.new}</p>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-600 uppercase tracking-wide">In Discussion</p>
          <p className="text-3xl font-bold text-amber-900 mt-1">{loading ? '...' : stats.inDiscussion}</p>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <p className="text-xs text-emerald-600 uppercase tracking-wide">Converted</p>
          <p className="text-3xl font-bold text-emerald-900 mt-1">{loading ? '...' : stats.converted}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="filter-name" className="block text-sm font-medium text-gray-700 mb-2">
              Search by Name or Email
            </label>
            <input
              id="filter-name"
              type="text"
              placeholder="Type name or email..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="filter-date-from" className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              id="filter-date-from"
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="filter-date-to" className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              id="filter-date-to"
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-from focus:border-transparent"
            />
          </div>
        </div>
        {(filterName || filterDateFrom || filterDateTo) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setFilterName('');
                setFilterDateFrom('');
                setFilterDateTo('');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6">
            <AdminTableSkeleton rows={6} columns={6} />
          </div>
        ) : filteredLeads.length > 0 ? (
          <LeadsTableClient initial={filteredLeads as any} />
        ) : (
          <div className="text-center py-16 px-6">
            <div className="inline-flex h-12 w-12 rounded-full bg-gray-100 items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">{filterName || filterDateFrom || filterDateTo ? 'No matching leads' : 'No leads yet'}</p>
            <p className="text-sm text-gray-500 mt-1">
              {filterName || filterDateFrom || filterDateTo ? 'Try adjusting your filters.' : 'When people submit the contact form, they\'ll appear here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
