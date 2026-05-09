'use client';

import { useState } from 'react';

type Lead = {
  _id: string;
  name: string;
  email: string;
  message: string;
  status?: string;
  createdAt: string;
};

export default function LeadsTableClient({ initial }: { initial: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initial);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const statuses = ['new', 'in_discussion', 'converted', 'bounced'];

  async function updateStatus(id: string, status: string) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      alert('Request failed');
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Message</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{lead.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{lead.message}</td>
              <td className="px-6 py-4 text-sm">
                <select
                  value={lead.status || 'new'}
                  onChange={(e) => updateStatus(lead._id, e.target.value)}
                  className="px-3 py-2 rounded-full border border-gray-200 text-sm"
                  disabled={loadingId === lead._id}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{new Date(lead.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => {
                    const next = prompt('Enter status (new, in_discussion, converted, bounced)', lead.status || 'new');
                    if (next) updateStatus(lead._id, next);
                  }}
                  className="text-accent-to hover:underline font-medium"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
