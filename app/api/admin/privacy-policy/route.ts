import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hasAdminSession } from '@/lib/admin';
import { sanitizeBlogHtml, stripHtmlTags } from '@/lib/html';
import PrivacyPolicyModel from '@/lib/models/PrivacyPolicy';

const DEFAULT_KEY = 'default';

export async function GET(request: Request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();
  const policy = await PrivacyPolicyModel.findOne({ key: DEFAULT_KEY }).lean();

  return NextResponse.json({
    ok: true,
    policy: {
      contentHTML: policy?.contentHTML || '',
      contactEmail: policy?.contactEmail || '',
      contactWebsite: policy?.contactWebsite || '',
      effectiveDate: policy?.effectiveDate || '',
      intro: policy?.intro || '',
      updatedAt: policy?.updatedAt || null,
    },
  });
}

export async function POST(request: Request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const contentHTML = sanitizeBlogHtml(body?.contentHTML || '');

  await connectToDatabase();
  // preserve existing contact fields when incoming values are empty
  const existing = await PrivacyPolicyModel.findOne({ key: DEFAULT_KEY }).lean();
  const incomingEmail = stripHtmlTags(String(body?.contactEmail ?? '')).trim();
  const incomingWebsite = stripHtmlTags(String(body?.contactWebsite ?? '')).trim();

  const existingEmail = existing?.contactEmail ?? '';
  const existingWebsite = existing?.contactWebsite ?? '';

  const contactEmail = incomingEmail || existingEmail || '';
  const contactWebsite = incomingWebsite || existingWebsite || '';
  const effectiveDate = String(body?.effectiveDate ?? '').trim();
  const intro = String(body?.intro ?? '').trim();

  const policy = await PrivacyPolicyModel.findOneAndUpdate(
    { key: DEFAULT_KEY },
    {
      $set: {
        contentHTML,
        contactEmail,
        contactWebsite,
        effectiveDate,
        intro,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  return NextResponse.json({
    ok: true,
    policy: {
      contentHTML: policy?.contentHTML || '',
      contactEmail: policy?.contactEmail || '',
      contactWebsite: policy?.contactWebsite || '',
      effectiveDate: policy?.effectiveDate || '',
      intro: policy?.intro || '',
      updatedAt: policy?.updatedAt || null,
    },
  });
}
