import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogModel from '@/lib/models/Blog';
import { checkAdminAuth } from '@/lib/admin';
import { blogPosts } from '@/lib/blog';

function sectionsToHTML(sections: any[]) {
  if (!sections || !sections.length) return '';
  let html = '<div class="prose max-w-none">';
  sections.forEach((s) => {
    if (s.heading) html += `<h2 class="text-2xl font-bold">${s.heading}</h2>`;
    if (s.paragraphs && s.paragraphs.length) {
      s.paragraphs.forEach((p: string) => {
        html += `<p class="mt-2">${p}</p>`;
      });
    }
    if (s.bullets && s.bullets.length) {
      html += '<ul class="list-disc pl-6 mt-2">';
      s.bullets.forEach((b: string) => {
        html += `<li>${b}</li>`;
      });
      html += '</ul>';
    }
  });
  html += '</div>';
  return html;
}

export async function POST(req: Request) {
  await checkAdminAuth();
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
