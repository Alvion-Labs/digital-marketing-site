'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminCardGridSkeleton, AdminPanelSkeleton, AdminPageTitleSkeleton } from '@/components/admin/AdminSkeletons';

type DashboardStats = {
  leadsCount: number;
  blogCount: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({ leadsCount: 0, blogCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const [blogsResponse, leadsResponse] = await Promise.all([
          fetch('/api/admin/blogs', { cache: 'no-store' }),
          fetch('/api/admin/leads', { cache: 'no-store' }),
        ]);

        if (blogsResponse.status === 401 || leadsResponse.status === 401) {
          router.replace('/admin/login');
          return;
        }

        const blogsJson = await blogsResponse.json();
        const leadsJson = await leadsResponse.json();

        if (!cancelled) {
          setStats({
            leadsCount: Array.isArray(leadsJson.leads) ? leadsJson.leads.length : 0,
            blogCount: Array.isArray(blogsJson.blogs) ? blogsJson.blogs.length : 0,
          });
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const statCards = [
    {
      label: 'Total Leads',
      value: stats.leadsCount,
      color: 'from-blue-500 to-cyan-500',
      icon: '👥',
      description: 'Captured from contact forms',
    },
    {
      label: 'Blog Posts',
      value: stats.blogCount,
      color: 'from-purple-500 to-fuchsia-500',
      icon: '📝',
      description: 'Published and scheduled content',
    },
  ];

  return (
    <div>
      <div className="mb-6">{loading ? <AdminPageTitleSkeleton /> : <h2 className="text-2xl font-bold admin-heading-gradient">Dashboard Overview</h2>}</div>

      {loading ? (
        <>
          <AdminCardGridSkeleton count={2} />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminPanelSkeleton />
            <AdminPanelSkeleton />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`h-1.5 bg-linear-to-r ${card.color}`} />
                <div className="p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600 ring-1 ring-gray-100">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Live metric
                      </div>
                      <p className="mt-4 text-sm font-medium text-gray-600">{card.label}</p>
                      <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">{card.value}</p>
                    </div>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${card.color} text-2xl text-white shadow-lg shadow-black/10`}>
                      {card.icon}
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">{card.description}</p>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full w-4/5 rounded-full bg-linear-to-r ${card.color} transition-all duration-300 group-hover:w-full`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold admin-heading-gradient">Quick Links</h3>
                  <p className="text-sm text-gray-500">Jump to the most used admin tools</p>
                </div>
                <span className="rounded-full bg-accent-from/10 px-3 py-1 text-xs font-semibold text-accent-from">Shortcuts</span>
              </div>
              <div className="grid gap-3">
                {[
                  { href: '/admin/leads', title: 'View all leads', description: 'Review submissions and update statuses', icon: '👥' },
                  { href: '/admin/analytics', title: 'View analytics', description: 'Check pipeline counts and traffic snapshots', icon: '📈' },
                  { href: '/admin/blogs', title: 'Manage blogs', description: 'Edit, publish, or delete blog content', icon: '📝' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-from/30 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl shadow-sm ring-1 ring-gray-100 transition-transform duration-300 group-hover:scale-105">
                      {link.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-gray-900">{link.title}</p>
                        <span className="text-gray-400 transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{link.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold admin-heading-gradient mb-4">System Status</h3>
              <div className="space-y-3">
                {[
                  { label: 'Database', value: 'Connected', tone: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
                  { label: 'API', value: 'Online', tone: 'bg-blue-50 text-blue-700 ring-blue-200' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${item.tone}`}>
                      {item.value}
                    </span>
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
