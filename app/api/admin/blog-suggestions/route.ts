import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogSuggestionModel from '@/lib/models/BlogSuggestion';
import { hasAdminSession } from '@/lib/admin';

export async function GET(req: NextRequest) {
  if (!hasAdminSession(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get('blogId');
    const status = searchParams.get('status');

    await connectToDatabase();

    const query: any = {};
    if (blogId) query.blogId = blogId;
    if (status) query.status = status;

    const suggestions = await BlogSuggestionModel.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ ok: true, suggestions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog suggestions:', error);
    return NextResponse.json({ ok: false, error: 'Failed to fetch suggestions' }, { status: 500 });
  }
}
