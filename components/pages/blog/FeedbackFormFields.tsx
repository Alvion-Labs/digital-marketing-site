import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

const baseFieldClass =
  'w-full bg-white border rounded-xl px-4 py-3 text-black placeholder-gray-400 text-sm focus:outline-none focus:border-accent-from focus:ring-1 focus:ring-accent-from transition-colors duration-200';

export function FeedbackFieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1.5">
      {children}
    </label>
  );
}

export function FeedbackTextInput({
  hasError = false,
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      {...props}
      className={`${baseFieldClass} ${hasError ? 'border-red-500' : 'border-gray-300'} ${className}`.trim()}
    />
  );
}

export function FeedbackTextarea({
  hasError = false,
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean }) {
  return (
    <textarea
      {...props}
      className={`${baseFieldClass} ${hasError ? 'border-red-500' : 'border-gray-300'} resize-none ${className}`.trim()}
    />
  );
}

export function FeedbackFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-red-400 text-xs mt-1">{message}</p>;
}
