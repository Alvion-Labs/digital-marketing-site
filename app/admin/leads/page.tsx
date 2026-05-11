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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        {loading ? <AdminPageTitleSkeleton /> : <h2 className="text-2xl font-bold admin-heading-gradient">Leads</h2>}
        <span className="px-4 py-2 bg-accent-from/10 text-accent-from rounded-full text-sm font-semibold">
          Total: {loading ? '...' : leads.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-6">
        {loading ? (
          <AdminTableSkeleton rows={6} columns={6} />
        ) : leads.length > 0 ? (
          <LeadsTableClient initial={leads as any} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No leads yet. When people submit the contact form, they'll appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
