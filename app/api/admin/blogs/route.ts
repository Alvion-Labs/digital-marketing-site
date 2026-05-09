import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogModel from '@/lib/models/Blog';
import { checkAdminAuth } from '@/lib/admin';

export async function GET() {
  await connectToDatabase();
  const blogs = await BlogModel.find({}).sort({ publishedAt: -1 }).lean();
  return NextResponse.json({ ok: true, blogs });
}

export async function POST(req: Request) {
  await checkAdminAuth();
  const body = await req.json();
  await connectToDatabase();

  const doc = await BlogModel.create({
    ...body,
  });

  return NextResponse.json({ ok: true, blog: doc });
}
