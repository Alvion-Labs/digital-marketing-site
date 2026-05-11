'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminCardGridSkeleton, AdminPageTitleSkeleton, AdminPanelSkeleton } from '@/components/admin/AdminSkeletons';

type Lead = {
  status?: string;
};

export default function Analytics() {
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

  const { counts, total } = useMemo(() => {
    const nextCounts: Record<string, number> = {
      new: 0,
      in_discussion: 0,
      converted: 0,
      bounced: 0,
    };

    leads.forEach((lead) => {
      const status = lead.status || 'new';
      if (Object.prototype.hasOwnProperty.call(nextCounts, status)) {
        nextCounts[status] += 1;
      }
    });

    return { counts: nextCounts, total: leads.length };
  }, [leads]);

  return (
    <div>
      <div className="mb-6">{loading ? <AdminPageTitleSkeleton /> : <h2 className="text-2xl font-bold admin-heading-gradient">Analytics</h2>}</div>

      {loading ? (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <AdminCardGridSkeleton count={5} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminPanelSkeleton />
            <AdminPanelSkeleton />
          </div>
        </>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold admin-heading-gradient mb-4">Lead Pipeline</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-600 text-sm font-medium">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{total}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-blue-700 text-sm font-medium">New</p>
                <p className="text-2xl font-bold text-blue-900 mt-2">{counts.new}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <p className="text-yellow-700 text-sm font-medium">In Discussion</p>
                <p className="text-2xl font-bold text-yellow-900 mt-2">{counts.in_discussion}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="text-green-700 text-sm font-medium">Converted</p>
                <p className="text-2xl font-bold text-green-900 mt-2">{counts.converted}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <p className="text-red-700 text-sm font-medium">Bounced</p>
                <p className="text-2xl font-bold text-red-900 mt-2">{counts.bounced}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold admin-heading-gradient mb-4">Traffic Source</h3>
              <div className="space-y-4">
                {[
                  { name: 'Organic Search', value: 45, color: 'bg-blue-500' },
                  { name: 'Direct', value: 30, color: 'bg-purple-500' },
                  { name: 'Social Media', value: 15, color: 'bg-pink-500' },
                  { name: 'Referral', value: 10, color: 'bg-green-500' },
                ].map((source) => (
                  <div key={source.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{source.name}</span>
                      <span className="text-sm font-bold text-gray-900">{source.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${source.color} h-2 rounded-full`} style={{ width: `${source.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold admin-heading-gradient mb-4">Top Pages</h3>
              <div className="space-y-3">
                {[
                  { path: '/', views: 1200 },
                  { path: '/blog', views: 542 },
                  { path: '/#services', views: 380 },
                  { path: '/#contact', views: 320 },
                ].map((page) => (
                  <div key={page.path} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 font-medium">{page.path}</span>
                    <span className="text-sm font-bold text-gray-900">{page.views}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
