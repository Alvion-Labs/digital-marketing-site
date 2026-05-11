// Placeholder: detailed block editors removed to keep repo clean.
import React from 'react';

export const BlockEditor: React.FC<{ block: any; onChange: (b: any) => void }> = ({ block }) => {
  return (
    <div className="p-3 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded">
      Block editor removed — edit raw HTML instead.
    </div>
  );
};

export default function PlaceholderBlockEditors() {
  return <div className="text-sm text-gray-500">Block editors removed.</div>;
}
