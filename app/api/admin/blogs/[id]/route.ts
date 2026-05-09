import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogModel from '@/lib/models/Blog';
import { checkAdminAuth } from '@/lib/admin';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const blog = await BlogModel.findById(id).lean();
  if (!blog) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true, blog });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await checkAdminAuth();
  const body = await req.json();
  await connectToDatabase();
  const updated = await BlogModel.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!updated) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true, blog: updated });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await checkAdminAuth();
  await connectToDatabase();
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
