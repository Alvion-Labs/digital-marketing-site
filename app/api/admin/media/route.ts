import { NextResponse } from 'next/server';
import { hasAdminSession } from '@/lib/admin';
import { uploadMedia, getAllMedia, deleteMedia, searchMedia } from '@/lib/media';
import { validateFileUpload } from '@/lib/fileValidation';
import { sanitizeSearchQuery, sanitizePaginationParams } from '@/lib/inputValidation';

export async function GET(req: Request) {
  if (!hasAdminSession(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const { limit, skip } = sanitizePaginationParams(
      searchParams.get('limit') || '100',
      searchParams.get('skip') || '0'
    );

    let result;
    if (query) {
      // Sanitize search query to prevent injection
      const sanitizedQuery = sanitizeSearchQuery(query);
      if (!sanitizedQuery) {
        return NextResponse.json(
          { ok: false, error: 'Invalid search query' },
          { status: 400 }
        );
      }
      const items = await searchMedia(sanitizedQuery, limit);
      result = { ok: true, items };
    } else {
      result = await getAllMedia({}, limit, skip);
    }

    return NextResponse.json({
      ok: true,
      items: result.items,
      total: result.total || result.items.length,
    });
  } catch (e) {
    console.error('Media GET error:', e);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  if (!hasAdminSession(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get('file') as any;

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate file
    const validation = validateFileUpload(
      {
        name: String(file.name),
        type: String(file.type),
        size: buffer.length,
      },
      buffer
    );

    if (!validation.valid) {
      return NextResponse.json({ ok: false, error: validation.error }, { status: 400 });
    }

    const usedBy = form.get('usedBy');
    const usage = usedBy ? JSON.parse(String(usedBy)) : undefined;

    const media = await uploadMedia(buffer, {
      originalName: String(file.name),
      mimeType: String(file.type),
      usedBy: usage,
    });

    return NextResponse.json({
      ok: true,
      file: media,
      path: media.publicUrl,
    });
  } catch (e) {
    console.error('Media POST error:', e);
    return NextResponse.json(
      { ok: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!hasAdminSession(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const filename = body?.filename;

    if (!filename) {
      return NextResponse.json({ ok: false, error: 'No filename' }, { status: 400 });
    }

    const success = await deleteMedia(filename, true);

    if (!success) {
      return NextResponse.json({ ok: false, error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Media DELETE error:', e);
    return NextResponse.json(
      { ok: false, error: 'Delete failed' },
      { status: 500 }
    );
  }
}
