import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import LeadModel from '@/lib/models/Lead';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
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
