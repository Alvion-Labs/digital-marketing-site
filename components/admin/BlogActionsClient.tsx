'use client';

import React, { useState } from 'react';
import { useToast, ToastContainer } from '@/components/global/Toast';
import ConfirmDialog from '@/components/global/ConfirmDialog';

export default function BlogActionsClient({ id }: { id: string }) {
  const { toasts, addToast, removeToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addToast('Blog post deleted successfully! Redirecting...', 'success', 2000);
        setTimeout(() => window.location.href = '/admin/blogs', 1500);
      } else {
        addToast('Failed to delete blog post. Please try again.', 'error', 5000);
        setIsDeleting(false);
      }
    } catch (e) {
      console.error(e);
      addToast('An error occurred while deleting. Please try again.', 'error', 5000);
      setIsDeleting(false);
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <ConfirmDialog
        isOpen={showConfirm}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
      <button type="button" className="text-red-600 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer" onClick={() => setShowConfirm(true)} disabled={isDeleting}>
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </>
  );
}
