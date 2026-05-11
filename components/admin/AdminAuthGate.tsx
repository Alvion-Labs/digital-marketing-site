'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export default function AdminAuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      try {
        const response = await fetch('/api/admin/auth', { cache: 'no-store' });

        if (!cancelled) {
          if (response.ok) {
            setChecking(false);
          } else {
            router.replace('/admin/login');
          }
        }
      } catch {
        if (!cancelled) {
          router.replace('/admin/login');
        }
      }
    }

    verifySession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-56 animate-pulse rounded-full bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
              <div className="mt-4 h-10 w-20 animate-pulse rounded-2xl bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}