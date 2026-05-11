import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogModel from '@/lib/models/Blog';
import { hasAdminSession } from '@/lib/admin';
import { blogPosts } from '@/lib/blog';
import { sanitizeBlogHtml } from '@/lib/html';

function sectionsToHTML(sections: any[]) {
  if (!sections || !sections.length) return '';
  let html = '';
  sections.forEach((s) => {
    html += '<section>';
    if (s.heading) html += `<h2>${s.heading}</h2>`;
    if (s.paragraphs && s.paragraphs.length) {
      s.paragraphs.forEach((p: string) => {
        html += `<p>${p}</p>`;
      });
    }
    if (s.bullets && s.bullets.length) {
      html += '<ul>';
      s.bullets.forEach((b: string) => {
        html += `<li>${b}</li>`;
      });
      html += '</ul>';
    }
    html += '</section>';
  });
  return sanitizeBlogHtml(html);
}

export async function POST(req: Request) {
  if (!hasAdminSession(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  let inserted = 0;
  let updated = 0;

  for (const p of blogPosts) {
    const contentHTML = sectionsToHTML(p.sections || []);
    const doc: any = {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      publishedAt: p.publishedAt ? new Date(p.publishedAt) : undefined,
      readTime: p.readTime,
      author: p.author,
      accentFrom: p.accentFrom,
      accentTo: p.accentTo,
      summary: p.summary,
      sections: p.sections || [],
      takeaways: p.takeaways || [],
      thumbnail: p.thumbnail,
      contentHTML,
      metaTitle: p.title,
      metaDescription: p.excerpt,
      canonical: `/blog/${p.slug}`,
      isDraft: false,
    };

    const existing = await BlogModel.findOne({ slug: p.slug });
    if (existing) {
      await BlogModel.findOneAndUpdate({ slug: p.slug }, doc, { new: true });
      updated += 1;
    } else {
      await BlogModel.create(doc);
      inserted += 1;
    }
  }

  return NextResponse.json({ ok: true, inserted, updated });
}
