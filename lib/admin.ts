import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_COOKIE_NAME = 'admin_session';

function getSessionSecret() {
  // Falls back for local/dev if secret is not set.
  return process.env.ADMIN_SESSION_SECRET || `${ADMIN_PASSWORD}-session-secret`;
}

function sign(value: string) {
  return createHmac('sha256', getSessionSecret()).update(value).digest('hex');
}

export function createAdminSessionToken() {
  const value = 'authenticated';
  const signature = sign(value);
  return `${value}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token) return false;

  const [value, signature] = token.split('.');
  if (!value || !signature) return false;

  const expected = sign(value);

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function validateAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function hasAdminSession(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.split('=')[1];

  return verifyAdminSessionToken(token);
}

export async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);

  if (!verifyAdminSessionToken(session?.value)) {
    redirect('/admin/login');
  }

  return true;
}
