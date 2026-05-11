'use client';

import { useState } from 'react';
import { useToast, ToastContainer } from '@/components/global/Toast';
import ConfirmDialog from '@/components/global/ConfirmDialog';

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
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const statuses = ['new', 'in_discussion', 'converted', 'bounced'];
  const statusStyles: Record<string, string> = {
    new: 'bg-slate-50 text-slate-700 ring-slate-200',
    in_discussion: 'bg-amber-50 text-amber-700 ring-amber-200',
    converted: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    bounced: 'bg-rose-50 text-rose-700 ring-rose-200',
  };

  function formatStatus(status?: string) {
    return (status || 'new').replace('_', ' ');
  }

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

  async function handleDelete(id: string, name: string) {
    if (!confirmDelete) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l._id !== id));
        addToast('Lead deleted successfully.', 'success', 3000);
        setConfirmDelete(null);
      } else {
        addToast('Failed to delete lead. Please try again.', 'error', 5000);
      }
    } catch (err) {
      console.error(err);
      addToast('An error occurred while deleting. Please try again.', 'error', 5000);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ConfirmDialog
        isOpen={confirmDelete !== null}
        title="Delete Lead"
        message={`Are you sure you want to delete the lead from ${confirmDelete?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={loadingId !== null}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete.id, confirmDelete.name)}
        onCancel={() => setConfirmDelete(null)}
      />
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
                <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-100">
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[lead.status || 'new']}`}>
                    <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                    {formatStatus(lead.status)}
                  </span>
                  <select
                    value={lead.status || 'new'}
                    onChange={(e) => updateStatus(lead._id, e.target.value)}
                    className="bg-transparent text-xs font-medium text-gray-500 outline-none cursor-pointer"
                    disabled={loadingId === lead._id}
                    aria-label={`Update status for ${lead.name}`}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{new Date(lead.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-sm">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const next = prompt('Enter status (new, in_discussion, converted, bounced)', lead.status || 'new');
                      if (next) updateStatus(lead._id, next);
                    }}
                    className="px-3 py-1.5 text-accent-to hover:bg-accent-from/10 rounded-full font-medium hover:cursor-pointer transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete({ id: lead._id, name: lead.name })}
                    disabled={loadingId === lead._id}
                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer transition-colors"
                  >
                    {loadingId === lead._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
