'use client';

import { ReactNode } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm animate-in zoom-in-95 duration-200 rounded-3xl border border-white/10 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
        <div className="p-6">
          <h2 className="mb-2 text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-sm leading-relaxed text-gray-600">{message}</p>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-full text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30'
                : 'bg-linear-to-r from-accent-from to-accent-to hover:shadow-lg hover:shadow-accent-from/30'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
