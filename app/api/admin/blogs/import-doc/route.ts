import { NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { hasAdminSession } from '@/lib/admin';

interface ParsedDocData {
  title: string;
  slug: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  author: string;
  category: string;
  readTime: string;
  canonical: string;
  thumbnail: string;
  tldr: string;
  conclusion: string;
  faqs: Array<{ question: string; answer: string }>;
  tableOfContents: Array<{ title: string; anchor: string }>;
  contentHTML: string;
}

type ParsedLabeledFields = {
  title?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  author?: string;
  category?: string;
  readTime?: string;
  canonical?: string;
  thumbnail?: string;
  tldr?: string;
  conclusion?: string;
};

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function getHeadingsFromHtml(html: string): Array<{ title: string; anchor: string }> {
  const headings: Array<{ title: string; anchor: string }> = [];
  const re = /<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi;

  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    const text = stripHtml(match[2]);
    if (!text) continue;

    headings.push({
      title: text,
      anchor: toSlug(text),
    });
  }

  // Deduplicate anchors
  const seen = new Map<string, number>();
  return headings.map((item) => {
    const count = seen.get(item.anchor) || 0;
    seen.set(item.anchor, count + 1);
    if (count === 0) return item;
    return { ...item, anchor: `${item.anchor}-${count + 1}` };
  });
}

function normalizeFieldLabel(raw: string): string {
  return raw.toLowerCase().replace(/\s+/g, '').trim();
}

function isKnownFieldLabel(label: string): boolean {
  return [
    'title',
    'excerpt',
    'metatitle',
    'metadescription',
    'author',
    'category',
    'readtime',
    'canonical',
    'thumbnail',
    'tldr',
    'conclusion',
    'toc',
    'tableofcontents',
    'faqs',
  ].includes(label);
}

function parseListItems(raw: string): string[] {
  return raw
    .split('\n')
    .flatMap((line) => {
      const cleaned = line
        .replace(/^\s*(?:[-*•]|\d+[\.)-])\s*/, '')
        .trim();

      if (!cleaned) return [] as string[];

      // Allow comma-separated values on same line
      if (cleaned.includes(',')) {
        return cleaned
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }

      return [cleaned];
    })
    .map((s) => s.replace(/^\s*(?:[-*•]|\d+[\.)-])\s*/, '').trim())
    .filter(Boolean);
}

function dedupeTocAnchors(items: Array<{ title: string; anchor: string }>): Array<{ title: string; anchor: string }> {
  const seen = new Map<string, number>();
  return items.map((item) => {
    const count = seen.get(item.anchor) || 0;
    seen.set(item.anchor, count + 1);
    if (count === 0) return item;
    return { ...item, anchor: `${item.anchor}-${count + 1}` };
  });
}

function extractLabeledBlock(rawText: string, fieldPattern: RegExp): string {
  const rawLines = rawText.split('\n');

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    const m = line.match(fieldPattern);
    if (!m) continue;

    const inlineValue = (m[1] || '').trim();
    if (inlineValue) return inlineValue;

    const chunks: string[] = [];
    let j = i + 1;
    while (j < rawLines.length) {
      const next = rawLines[j].trim();
      if (!next) {
        j++;
        continue;
      }
      const nextMatch = next.match(/^([A-Za-z][A-Za-z\s]+)\s*:\s*(.*)$/);
      if (nextMatch && isKnownFieldLabel(normalizeFieldLabel(nextMatch[1]))) {
        break;
      }
      chunks.push(next);
      j++;
    }

    return chunks.join('\n').trim();
  }

  return '';
}

function extractTocFromLabeledText(rawText: string): Array<{ title: string; anchor: string }> {
  const tocBlock = extractLabeledBlock(rawText, /^(?:TOC|Table\s*of\s*Contents)\s*:\s*(.*)$/i);
  if (!tocBlock) return [];

  const titles = parseListItems(tocBlock);
  const mapped = titles.map((title) => ({ title, anchor: toSlug(title) })).filter((t) => t.title && t.anchor);
  return dedupeTocAnchors(mapped);
}

function parseLabeledFields(rawText: string): ParsedLabeledFields {
  const rawLines = rawText.split('\n');
  const result: ParsedLabeledFields = {};

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();
    if (!line) continue;

    const match = line.match(/^([A-Za-z][A-Za-z\s]+)\s*:\s*(.*)$/);
    if (!match) continue;

    const label = normalizeFieldLabel(match[1]);
    if (!isKnownFieldLabel(label) || label === 'faqs') continue;

    let value = (match[2] || '').trim();

    // Support multiline values when `Field:` is on its own line
    if (!value) {
      const chunks: string[] = [];
      let j = i + 1;
      while (j < rawLines.length) {
        const next = rawLines[j].trim();
        if (!next) {
          j++;
          continue;
        }
        const nextMatch = next.match(/^([A-Za-z][A-Za-z\s]+)\s*:\s*(.*)$/);
        if (nextMatch && isKnownFieldLabel(normalizeFieldLabel(nextMatch[1]))) {
          break;
        }
        chunks.push(next);
        j++;
      }
      value = chunks.join(' ').trim();
      i = j - 1;
    }

    if (!value) continue;

    switch (label) {
      case 'title':
        result.title = value;
        break;
      case 'excerpt':
        result.excerpt = value;
        break;
      case 'metatitle':
        result.metaTitle = value;
        break;
      case 'metadescription':
        result.metaDescription = value;
        break;
      case 'author':
        result.author = value;
        break;
      case 'category':
        result.category = value;
        break;
      case 'readtime':
        result.readTime = value;
        break;
      case 'canonical':
        result.canonical = value;
        break;
      case 'thumbnail':
        result.thumbnail = value;
        break;
      case 'tldr':
        result.tldr = value;
        break;
      case 'conclusion':
        result.conclusion = value;
        break;
      default:
        break;
    }
  }

  return result;
}

function extractFaqs(rawText: string): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  const faqRegex = /(?:^|\n)\s*(?:Q|Question)\s*[:\-]\s*(.+?)\n\s*(?:A|Answer)\s*[:\-]\s*([\s\S]*?)(?=\n\s*(?:Q|Question)\s*[:\-]|$)/gi;

  let match: RegExpExecArray | null;
  while ((match = faqRegex.exec(rawText)) !== null) {
    const question = (match[1] || '').trim();
    const answer = (match[2] || '').trim();
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  if (faqs.length > 0) return faqs;

  // Fallback: parse from FAQs block with numbered/comma styles
  const faqBlock = extractLabeledBlock(rawText, /^FAQs?\s*:\s*(.*)$/i);
  if (!faqBlock) return faqs;

  const lines = faqBlock
    .split('\n')
    .map((l) => l.replace(/^\s*(?:[-*•]|\d+[\.)-])\s*/, '').trim())
    .filter(Boolean);

  // Style A: one FAQ per line, question and answer separated by comma
  // Example: What is SEO?, SEO is...
  for (const line of lines) {
    const commaIdx = line.indexOf(',');
    if (commaIdx > 0) {
      const question = line.slice(0, commaIdx).trim();
      const answer = line.slice(commaIdx + 1).trim();
      if (question && answer) {
        faqs.push({ question, answer });
      }
    }
  }

  if (faqs.length > 0) return faqs;

  // Style B: comma stream alternating Q, A, Q, A
  // Example: Q1, A1, Q2, A2
  const parts = faqBlock
    .split(',')
    .map((p) => p.replace(/^\s*(?:[-*•]|\d+[\.)-])\s*/, '').trim())
    .filter(Boolean);

  for (let i = 0; i + 1 < parts.length; i += 2) {
    const question = parts[i];
    const answer = parts[i + 1];
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}

function stripMetadataLinesForExcerpt(rawText: string): string[] {
  return rawText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((line) => {
      if (/^(?:Q|Question|A|Answer)\s*[:\-]/i.test(line)) return false;
      const match = line.match(/^([A-Za-z][A-Za-z\s]+)\s*:\s*(.*)$/);
      if (!match) return true;
      const label = normalizeFieldLabel(match[1]);
      return !isKnownFieldLabel(label);
    });
}

function parseDocData(html: string, rawText: string): ParsedDocData {
  const labeled = parseLabeledFields(rawText);
  const cleanLines = stripMetadataLinesForExcerpt(rawText);
  const faqs = extractFaqs(rawText);

  const title = labeled.title || cleanLines[0] || '';
  const slug = toSlug(title);
  const plainText = cleanLines.join(' ');
  const excerpt = labeled.excerpt || plainText;
  const tocFromLabels = extractTocFromLabeledText(rawText);
  const toc = tocFromLabels.length > 0 ? tocFromLabels : getHeadingsFromHtml(html);

  return {
    title,
    slug,
    excerpt,
    metaTitle: labeled.metaTitle || title,
    metaDescription: (labeled.metaDescription || excerpt).slice(0, 160),
    author: labeled.author || '',
    category: labeled.category || '',
    readTime: labeled.readTime || '',
    canonical: labeled.canonical || '',
    thumbnail: labeled.thumbnail || '',
    tldr: labeled.tldr || '',
    conclusion: labeled.conclusion || '',
    faqs,
    tableOfContents: toc,
    contentHTML: html,
  };
}

export async function POST(req: Request) {
  if (!hasAdminSession(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: 'No file uploaded' }, { status: 400 });
    }

    const fileName = file.name?.toLowerCase() || '';
    if (!fileName.endsWith('.docx')) {
      return NextResponse.json(
        { ok: false, error: 'Only .docx files are supported. Export your Google Doc as .docx first.' },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: 'File too large. Max 10MB.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const [htmlResult, textResult] = await Promise.all([
      mammoth.convertToHtml({ buffer }),
      mammoth.extractRawText({ buffer }),
    ]);

    const parsed = parseDocData(htmlResult.value || '', textResult.value || '');

    return NextResponse.json({
      ok: true,
      parsed,
      messages: htmlResult.messages || [],
    });
  } catch (error) {
    console.error('DOC import error:', error);
    return NextResponse.json({ ok: false, error: 'Failed to parse document' }, { status: 500 });
  }
}
