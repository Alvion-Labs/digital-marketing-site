import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import LeadModel from '@/lib/models/Lead';
import { hasAdminSession } from '@/lib/admin';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await connectToDatabase();
  const lead = await LeadModel.findById(id).lean();

  if (!lead) return NextResponse.json({ ok: false, error: 'Lead not found' }, { status: 404 });

  return NextResponse.json({ ok: true, lead });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!hasAdminSession(request)) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body as { status?: string };

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    await connectToDatabase();
    const updated = await LeadModel.findByIdAndUpdate(id, { status }, { new: true }).lean();

    if (!updated) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error('Failed to update lead status', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!hasAdminSession(request)) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();
    const deleted = await LeadModel.findByIdAndDelete(id);

    if (!deleted) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete lead', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
