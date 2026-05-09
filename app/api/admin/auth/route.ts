import { NextResponse } from 'next/server';
import { validateAdminPassword } from '@/lib/admin';

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password?: string };

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    if (!validateAdminPassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true }, { status: 200 });

    // Set admin session cookie
    res.cookies.set('admin_session', 'authenticated', {
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
