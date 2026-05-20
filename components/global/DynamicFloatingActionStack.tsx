'use client';

import dynamic from 'next/dynamic';

const FloatingActionStack = dynamic(
  () => import('@/components/global/FloatingActionStack'),
  { ssr: false }
);

export default function DynamicFloatingActionStack() {
  return <FloatingActionStack />;
}