import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import LeadModel from '@/lib/models/Lead';
import { hasAdminSession } from '@/lib/admin';

export async function GET(request: Request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const leads = await LeadModel.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, leads });
}