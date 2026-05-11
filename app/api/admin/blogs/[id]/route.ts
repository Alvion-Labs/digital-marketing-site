import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogModel from '@/lib/models/Blog';
import { hasAdminSession } from '@/lib/admin';
import { sanitizeBlogHtml } from '@/lib/html';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasAdminSession(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await connectToDatabase();
  const blog = await BlogModel.findById(id).lean();
  if (!blog) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true, blog });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasAdminSession(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  await connectToDatabase();

  const existing = await BlogModel.findById(id).lean();
  if (!existing) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

  // Use contentHTML directly (contentBlocks support removed)
  const contentHTML = body.contentHTML ?? existing.contentHTML ?? '';

  const nextIsDraft = body.isDraft ?? existing.isDraft;
  const shouldSetPublishedAt = nextIsDraft === false && !existing.publishedAt && !body.publishedAt;

  const updated = await BlogModel.findByIdAndUpdate(
    id,
    {
      ...body,
      contentHTML: sanitizeBlogHtml(contentHTML),
      publishedAt: body.publishedAt ?? existing.publishedAt ?? (shouldSetPublishedAt ? new Date() : existing.publishedAt),
    },
    { new: true }
  ).lean();
  if (!updated) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true, blog: updated });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasAdminSession(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await connectToDatabase();
  await BlogModel.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
