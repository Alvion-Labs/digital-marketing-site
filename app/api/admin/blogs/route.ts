import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogModel from '@/lib/models/Blog';
import { hasAdminSession } from '@/lib/admin';
import { sanitizeBlogHtml, stripHtmlTags } from '@/lib/html';
import { dedupeFaqEntries } from '@/lib/blog';

export async function GET(request: Request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const blogs = await BlogModel.find({}).sort({ publishedAt: -1 }).lean();
  return NextResponse.json({ ok: true, blogs });
}

export async function POST(req: Request) {
  if (!hasAdminSession(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  await connectToDatabase();

  // Use contentHTML directly (contentBlocks support removed)
  const contentHTML = body.contentHTML || '';

  const blogData = {
    ...body,
    contentHTML: sanitizeBlogHtml(contentHTML),
    // conclusion must be plain text (pre-styled in rendering)
    conclusion: stripHtmlTags(body.conclusion || ''),
    // TL;DR support HTML content
    tldr: sanitizeBlogHtml(body.tldr || ''),
    faqs: Array.isArray(body.faqs)
      ? dedupeFaqEntries(
          body.faqs.map((f: any) => ({
            question: stripHtmlTags(f.question || ''),
            answer: sanitizeBlogHtml(f.answer || ''),
          }))
        )
      : [],
    publishedAt: body.isDraft === false ? body.publishedAt || new Date() : body.publishedAt,
  };

  // Ensure readTime is explicitly set (defensive)
  if (typeof body.readTime === 'string' && body.readTime.trim() !== '') {
    (blogData as any).readTime = body.readTime.trim();
  } else {
    (blogData as any).readTime = body.readTime || '';
  }

  const doc = await BlogModel.create(blogData);
  return NextResponse.json({ ok: true, blog: doc });
}
