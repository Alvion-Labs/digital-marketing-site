import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminIndexPage() {
  const hdr = await headers();
  const cookieHeader = hdr.get('cookie') ?? '';

  if (cookieHeader.includes('admin_session=authenticated')) {
    redirect('/admin/dashboard');
  }

  redirect('/admin/login');
}
