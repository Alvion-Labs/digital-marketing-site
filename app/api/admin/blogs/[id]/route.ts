import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogModel from '@/lib/models/Blog';
import { hasAdminSession } from '@/lib/admin';
import { sanitizeBlogHtml, stripHtmlTags } from '@/lib/html';

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

  const conclusionHtml = body.conclusion ?? existing.conclusion ?? '';
  const faqsBody = body.faqs ?? existing.faqs ?? [];

  const nextIsDraft = body.isDraft ?? existing.isDraft;
  const shouldSetPublishedAt = nextIsDraft === false && !existing.publishedAt && !body.publishedAt;

  // Build update object with explicit conclusion handling
  const updatePayload = {
    ...body,
    contentHTML: sanitizeBlogHtml(contentHTML),
    conclusion: stripHtmlTags(conclusionHtml),
    // TL;DR short summary
    tldr: stripHtmlTags(body.tldr ?? existing.tldr ?? ''),
    faqs: Array.isArray(faqsBody)
      ? faqsBody.map((f: any) => ({
          question: stripHtmlTags(f.question || ''),
          answer: sanitizeBlogHtml(f.answer || ''),
        }))
      : [],
    // ensure readTime is preserved/updated explicitly
    readTime: typeof body.readTime === 'string' && body.readTime.trim() !== '' ? body.readTime.trim() : existing.readTime || '',
    publishedAt: body.publishedAt ?? existing.publishedAt ?? (shouldSetPublishedAt ? new Date() : existing.publishedAt),
  };

  console.log('📥 PATCH received conclusion from client:', body.conclusion);
  console.log('🔄 After stripHtmlTags, conclusion is:', stripHtmlTags(conclusionHtml));
  console.log('💾 About to update with conclusion:', updatePayload.conclusion);
  
  const updated = await BlogModel.findByIdAndUpdate(id, updatePayload, { new: true }).lean();
  
  console.log('✅ Blog updated. Conclusion in DB:', updated?.conclusion);
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
