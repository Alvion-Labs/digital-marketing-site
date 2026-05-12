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
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Message</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, idx) => (
            <tr key={lead._id} className={`transition-colors ${idx === leads.length - 1 ? '' : 'border-b border-gray-200'} hover:bg-gray-50`}>
              <td className="px-6 py-4">
                <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-600">{lead.email}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-600 max-w-xs truncate" title={lead.message}>{lead.message}</p>
              </td>
              <td className="px-6 py-4">
                <select
                  value={lead.status || 'new'}
                  onChange={(e) => updateStatus(lead._id, e.target.value)}
                  disabled={loadingId === lead._id}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border outline-none transition-all ${statusStyles[lead.status || 'new']} cursor-pointer`}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {formatStatus(s)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-gray-600">{new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => setConfirmDelete({ id: lead._id, name: lead.name })}
                  disabled={loadingId === lead._id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingId === lead._id ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
