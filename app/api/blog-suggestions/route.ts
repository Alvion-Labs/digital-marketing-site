import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogSuggestionModel from '@/lib/models/BlogSuggestion';
import BlogModel from '@/lib/models/Blog';
import { isValidEmail, sanitizeUserInput } from '@/lib/inputValidation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    // Basic IP-based rate limiting to mitigate spam/abuse
    const clientIp = getClientIp(req as Request);
    const allowed = checkRateLimit(clientIp, 10, 60 * 60 * 1000); // 10 requests per hour
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const captchaToken = typeof body.captchaToken === 'string' ? body.captchaToken : '';

    // Verify reCAPTCHA v2 token server-side
    if (!captchaToken) {
      return NextResponse.json({ error: 'Missing captcha token' }, { status: 400 });
    }

    const secret = process.env.RECAPTCHA_SECRET || process.env.RECAPTCHA_V2_SECRET || '';
    if (!secret) {
      console.error('reCAPTCHA secret not configured');
      return NextResponse.json({ error: 'Captcha verification unavailable' }, { status: 500 });
    }

    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: captchaToken, remoteip: clientIp }),
    });

    const verifyJson = await verifyRes.json();
    if (!verifyJson.success) {
      return NextResponse.json({ error: 'Captcha verification failed' }, { status: 401 });
    }
    const rawBlogId = typeof body.blogId === 'string' ? body.blogId.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const rating = Number(body.rating);
    const suggestionRaw = typeof body.suggestion === 'string' ? body.suggestion : '';

    if (!rawBlogId || !email || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields: blogId, email, rating' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    if (suggestionRaw.length > 5000) {
      return NextResponse.json(
        { error: 'Suggestion text is too long (max 5000 characters)' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const blog =
      (await BlogModel.findById(rawBlogId).select('_id slug').lean()) ||
      (await BlogModel.findOne({ slug: rawBlogId }).select('_id slug').lean());

    if (!blog?._id) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const suggestion = await BlogSuggestionModel.create({
      blogId: blog._id,
      blogSlug: blog.slug || '',
      email,
      rating,
      suggestion: sanitizeUserInput(suggestionRaw),
    });

    await BlogModel.updateOne(
      { _id: blog._id },
      { $addToSet: { suggestionIds: suggestion._id } }
    );

    return NextResponse.json(
      {
        ok: true,
        message: 'Suggestion submitted successfully',
        suggestionId: String(suggestion._id),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog suggestion:', error);
    return NextResponse.json({ error: 'Failed to submit suggestion' }, { status: 500 });
  }
}
