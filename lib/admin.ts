import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export function validateAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || !session.value) {
    redirect('/admin/login');
  }

  return true;
}
