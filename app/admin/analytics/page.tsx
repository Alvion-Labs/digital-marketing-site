'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AdminCardGridSkeleton, AdminPageTitleSkeleton, AdminPanelSkeleton } from '@/components/admin/AdminSkeletons';

type Lead = {
  status?: string;
  createdAt: string;
};

export default function Analytics() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartDays, setChartDays] = useState(30);
  const [filterStatus, setFilterStatus] = useState<string>('all');

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

  const { counts, total, dailyStats, chartData } = useMemo(() => {
    const nextCounts: Record<string, number> = {
      new: 0,
      in_discussion: 0,
      converted: 0,
      bounced: 0,
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    let todayCount = 0;
    let yesterdayCount = 0;
    let lastWeekCount = 0;
    let lastMonthCount = 0;

    // Create chart data based on selected days
    const dailyLeadsMap: Record<string, { total: number; new: number; in_discussion: number; converted: number; bounced: number }> = {};
    for (let i = chartDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyLeadsMap[dateStr] = { total: 0, new: 0, in_discussion: 0, converted: 0, bounced: 0 };
    }

    leads.forEach((lead) => {
      const status = lead.status || 'new';
      if (Object.prototype.hasOwnProperty.call(nextCounts, status)) {
        nextCounts[status] += 1;
      }

      const leadDate = new Date(lead.createdAt);
      const leadDateOnly = new Date(leadDate.getFullYear(), leadDate.getMonth(), leadDate.getDate());

      if (leadDateOnly.getTime() === today.getTime()) {
        todayCount += 1;
      } else if (leadDateOnly.getTime() === yesterday.getTime()) {
        yesterdayCount += 1;
      }

      if (leadDate >= lastWeek) {
        lastWeekCount += 1;
      }

      if (leadDate >= lastMonth) {
        lastMonthCount += 1;
      }

      // Add to daily leads map
      const dateStr = leadDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dateStr in dailyLeadsMap) {
        dailyLeadsMap[dateStr].total += 1;
        if (status === 'new') dailyLeadsMap[dateStr].new += 1;
        if (status === 'in_discussion') dailyLeadsMap[dateStr].in_discussion += 1;
        if (status === 'converted') dailyLeadsMap[dateStr].converted += 1;
        if (status === 'bounced') dailyLeadsMap[dateStr].bounced += 1;
      }
    });

    const chartData = Object.entries(dailyLeadsMap).map(([date, data]) => ({
      date,
      total: data.total,
      new: data.new,
      in_discussion: data.in_discussion,
      converted: data.converted,
      bounced: data.bounced,
    }));

    return {
      counts: nextCounts,
      total: leads.length,
      dailyStats: { todayCount, yesterdayCount, lastWeekCount, lastMonthCount },
      chartData,
    };
  }, [leads, chartDays]);

  return (
    <div>
      <div className="mb-6">{loading ? <AdminPageTitleSkeleton /> : <h2 className="text-2xl font-bold admin-heading-gradient">Analytics</h2>}</div>

      {loading ? (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <AdminCardGridSkeleton count={9} />
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

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold admin-heading-gradient mb-4">Lead Activity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <p className="text-blue-700 text-sm font-medium">Today</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{dailyStats.todayCount}</p>
                <p className="text-xs text-blue-600 mt-1">New leads today</p>
              </div>
              <div className="p-4 bg-linear-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <p className="text-purple-700 text-sm font-medium">Yesterday</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">{dailyStats.yesterdayCount}</p>
                <p className="text-xs text-purple-600 mt-1">Leads yesterday</p>
              </div>
              <div className="p-4 bg-linear-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                <p className="text-amber-700 text-sm font-medium">This Week</p>
                <p className="text-3xl font-bold text-amber-900 mt-2">{dailyStats.lastWeekCount}</p>
                <p className="text-xs text-amber-600 mt-1">Last 7 days</p>
              </div>
              <div className="p-4 bg-linear-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                <p className="text-emerald-700 text-sm font-medium">This Month</p>
                <p className="text-3xl font-bold text-emerald-900 mt-2">{dailyStats.lastMonthCount}</p>
                <p className="text-xs text-emerald-600 mt-1">Last 30 days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h3 className="text-lg font-bold admin-heading-gradient">Lead Trend</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Time Period</label>
                  <select
                    value={chartDays}
                    onChange={(e) => setChartDays(Number(e.target.value))}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-from"
                  >
                    <option value={7}>Last 7 Days</option>
                    <option value={14}>Last 14 Days</option>
                    <option value={30}>Last 30 Days</option>
                    <option value={60}>Last 60 Days</option>
                    <option value={90}>Last 90 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Lead Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent-from"
                  >
                    <option value="all">All Leads</option>
                    <option value="new">New</option>
                    <option value="in_discussion">In Discussion</option>
                    <option value="converted">Converted</option>
                    <option value="bounced">Bounced</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="w-full h-80 -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    labelStyle={{ color: '#111827' }}
                    formatter={(value) => [value, '']}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  {filterStatus === 'all' && (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#6366f1" 
                        strokeWidth={3}
                        dot={{ fill: '#6366f1', r: 5 }}
                        activeDot={{ r: 7 }}
                        name="Total Leads"
                      />
                    </>
                  )}
                  {(filterStatus === 'all' || filterStatus === 'new') && (
                    <Line 
                      type="monotone" 
                      dataKey="new" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      name="New"
                    />
                  )}
                  {(filterStatus === 'all' || filterStatus === 'in_discussion') && (
                    <Line 
                      type="monotone" 
                      dataKey="in_discussion" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', r: 4 }}
                      name="In Discussion"
                    />
                  )}
                  {(filterStatus === 'all' || filterStatus === 'converted') && (
                    <Line 
                      type="monotone" 
                      dataKey="converted" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                      name="Converted"
                    />
                  )}
                  {(filterStatus === 'all' || filterStatus === 'bounced') && (
                    <Line 
                      type="monotone" 
                      dataKey="bounced" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={{ fill: '#ef4444', r: 4 }}
                      name="Bounced"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
