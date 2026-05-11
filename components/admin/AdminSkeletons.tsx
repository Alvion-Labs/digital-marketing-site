'use client';

export function AdminPageTitleSkeleton() {
  return <div className="h-8 w-72 animate-pulse rounded-full bg-gray-200" />;
}

export function AdminCardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
          <div className="mt-4 h-10 w-20 animate-pulse rounded-2xl bg-gray-200" />
          <div className="mt-6 h-1 w-full animate-pulse rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export function AdminTableSkeleton({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-200 last:border-b-0">
                {Array.from({ length: columns }).map((__, columnIndex) => (
                  <td key={columnIndex} className="px-6 py-4">
                    <div className="h-4 animate-pulse rounded-full bg-gray-200" style={{ width: '11rem' }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminPanelSkeleton() {
  return (
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="h-5 w-40 animate-pulse rounded-full bg-gray-200" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
            <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />
            <div className="h-2 w-full animate-pulse rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}