'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import AdminAuthGate from '@/components/admin/AdminAuthGate';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '/icons/chart.svg' },
  { label: 'Analytics', href: '/admin/analytics', icon: '/icons/trend.svg' },
  { label: 'Leads', href: '/admin/leads', icon: '/icons/people.svg' },
  { label: 'Blogs', href: '/admin/blogs', icon: '/icons/blog.svg' },
  { label: 'Blog Suggestions', href: '/admin/blog-suggestions', icon: '/icons/blog.svg' },
  { label: 'Privacy Policy', href: '/admin/privacy-policy', icon: '/icons/blog.svg' },
  { label: 'Media', href: '/admin/media', icon: '/icons/media-page.svg' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = sidebarOpen || hovered;
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (e) {
      // ignore network errors, still navigate to login
    }

    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`${
          open ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 fixed h-screen left-0 top-0 z-40 flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-3">
            <div className={`relative ${open ? 'w-24' : 'w-10'}`} style={{ aspectRatio: '120 / 40' }}>
              <Image
                src="/Alvion%20Logo%20landsacpe.webp"
                alt="Alvion"
                fill
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
            const isActive = pathname === item.href;
            const baseClasses = open ? 'flex items-center gap-4 px-4 py-3 rounded-full' : 'flex items-center justify-center px-3 py-3 rounded-full';
            const stateClasses = isActive
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-100 hover:cursor-pointer';

            const linkClass = `transition-all duration-200 ${baseClasses} ${stateClasses}`;

            const iconWrapperClass = 'flex h-5 w-5 shrink-0 items-center justify-center';

            return (
              <Link key={item.href} href={item.href} className={linkClass}>
                <div className={iconWrapperClass}>
                  <Image src={item.icon} alt={`${item.label} icon`} width={20} height={20} className="h-5 w-5 object-contain" />
                </div>
                {open && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-full transition-colors text-sm font-medium hover:cursor-pointer"
          >
            {open ? 'Logout' : '🚪'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className={`${open ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300`}>
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
          <h1 className="text-xl font-bold admin-heading-gradient">Admin Dashboard</h1>
        </div>
        <div className="p-8">{isLoginPage ? children : <AdminAuthGate>{children}</AdminAuthGate>}</div>
      </main>
    </div>
  );
}
