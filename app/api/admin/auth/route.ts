import { NextResponse } from 'next/server';
import {
  validateAdminPassword,
  hasAdminSession,
  createAdminSessionToken,
} from '@/lib/admin';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const AUTH_RATE_LIMIT = 10;
const AUTH_RATE_WINDOW = 15 * 60 * 1000; // 15 minutes

export async function GET(request: Request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    if (!checkRateLimit(`admin-auth:${clientIp}`, AUTH_RATE_LIMIT, AUTH_RATE_WINDOW)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { password } = (await request.json()) as { password?: string };

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    if (!validateAdminPassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true }, { status: 200 });

    // Set admin session cookie
    res.cookies.set('admin_session', createAdminSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const res = NextResponse.json({ success: true }, { status: 200 });

  // Clear admin session cookie
  res.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });

  return res;
}
