'use client';

import React from 'react';

export default function BlogActionsClient({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm('Delete this blog?')) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        // reload the page to reflect deletion
        window.location.reload();
      } else {
        alert('Failed to delete');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to delete');
    }
  }

  return (
    <button type="button" className="text-red-600" onClick={handleDelete}>
      Delete
    </button>
  );
}
