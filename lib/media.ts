import fs from 'fs/promises';
import path from 'path';
import { connectToDatabase } from './mongodb';
import MediaModel from './models/Media';
import { randomBytes } from 'crypto';

const MEDIA_DIR = path.join(process.cwd(), 'public', 'blogs', 'Media');
const PUBLIC_URL_PREFIX = '/blogs/Media';

export interface MediaFile {
  _id?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  publicUrl: string;
  uploadedAt: Date;
  dimensions?: { width: number; height: number };
  usedBy?: Array<{ type: string; field: string; module: string }>;
}

export interface UploadOptions {
  originalName?: string;
  mimeType?: string;
  usedBy?: { type: string; field: string; module: string };
}

/**
 * Ensure media directory exists
 */
export async function ensureMediaDir() {
  try {
    await fs.mkdir(MEDIA_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed to create media directory:', e);
  }
}

/**
 * Upload a file to the centralized media storage
 * @param file File buffer or Blob
 * @param options Upload options (originalName, mimeType, usedBy)
 * @returns Media metadata
 */
export async function uploadMedia(
  file: Buffer,
  options: UploadOptions = {}
): Promise<MediaFile> {
  await ensureMediaDir();
  await connectToDatabase();

  try {
    // Generate safe filename
    const ext = getFileExtension(options.originalName);
    const uniqueId = randomBytes(4).toString('hex');
    const timestamp = Date.now();
    const filename = `${timestamp}-${uniqueId}${ext}`;

    // Write file to disk
    const targetPath = path.join(MEDIA_DIR, filename);
    await fs.writeFile(targetPath, file);

    // Create media record in database
    const publicUrl = `${PUBLIC_URL_PREFIX}/${encodeURIComponent(filename)}`;
    
    const mediaRecord = await MediaModel.create({
      filename,
      originalName: options.originalName || filename,
      mimeType: options.mimeType || 'application/octet-stream',
      size: file.length,
      storagePath: path.relative(process.cwd(), targetPath),
      publicUrl,
      usedBy: options.usedBy ? [options.usedBy as any] : [],
      uploadedAt: new Date(),
    });

    return formatMediaResponse(mediaRecord);
  } catch (e) {
    console.error('Media upload error:', e);
    throw new Error('Failed to upload media');
  }
}

/**
 * Get all media files
 * @param filter Filter options (isDeleted, tags, etc.)
 * @param limit Pagination limit
 * @param skip Pagination skip
 */
export async function getAllMedia(
  filter: any = {},
  limit = 100,
  skip = 0
): Promise<{ items: MediaFile[]; total: number }> {
  await connectToDatabase();

  try {
    const defaultFilter = { isDeleted: false, ...filter };
    const items = await MediaModel.find(defaultFilter)
      .sort({ uploadedAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await MediaModel.countDocuments(defaultFilter);

    return {
      items: items.map(formatMediaResponse),
      total,
    };
  } catch (e) {
    console.error('Failed to fetch media:', e);
    return { items: [], total: 0 };
  }
}

/**
 * Get media by filename
 */
export async function getMediaByFilename(filename: string): Promise<MediaFile | null> {
  await connectToDatabase();

  try {
    const media = await MediaModel.findOne({ filename, isDeleted: false }).lean();
    return media ? formatMediaResponse(media) : null;
  } catch (e) {
    console.error('Failed to fetch media:', e);
    return null;
  }
}

/**
 * Delete media file
 */
export async function deleteMedia(filename: string, hardDelete = false): Promise<boolean> {
  await ensureMediaDir();
  await connectToDatabase();

  try {
    const media = await MediaModel.findOne({ filename });
    if (!media) return false;

    if (hardDelete) {
      // Hard delete: remove from disk and database
      const targetPath = path.join(MEDIA_DIR, filename);
      try {
        await fs.unlink(targetPath);
      } catch (e) {
        // ignore if file doesn't exist
      }
      await MediaModel.deleteOne({ filename });
    } else {
      // Soft delete: mark as deleted
      await MediaModel.updateOne({ filename }, { isDeleted: true });
    }

    return true;
  } catch (e) {
    console.error('Failed to delete media:', e);
    return false;
  }
}

/**
 * Track media usage
 */
export async function trackMediaUsage(
  filename: string,
  usage: { type: string; field: string; module: string }
): Promise<boolean> {
  await connectToDatabase();

  try {
    const media = await MediaModel.findOne({ filename });
    if (!media) return false;

    // Check if already tracked
    const exists = media.usedBy?.some(
      (u: any) => u.type === usage.type && u.field === usage.field && u.module === usage.module
    );

    if (!exists) {
      media.usedBy = media.usedBy || [];
      (media.usedBy as any).push(usage);
      await media.save();
    }

    return true;
  } catch (e) {
    console.error('Failed to track media usage:', e);
    return false;
  }
}

/**
 * Remove media usage reference
 */
export async function removeMediaUsage(
  filename: string,
  usage: { type: string; field: string; module: string }
): Promise<boolean> {
  await connectToDatabase();

  try {
    const media = await MediaModel.findOne({ filename });
    if (!media) return false;

    const nextUsedBy = (media.usedBy || []).filter(
      (u: any) => !(u.type === usage.type && u.field === usage.field && u.module === usage.module)
    );
    media.set('usedBy', nextUsedBy as any);

    await media.save();
    return true;
  } catch (e) {
    console.error('Failed to remove media usage:', e);
    return false;
  }
}

/**
 * Search media by filename or tags
 */
export async function searchMedia(query: string, limit = 50): Promise<MediaFile[]> {
  await connectToDatabase();

  try {
    const results = await MediaModel.find({
      isDeleted: false,
      $or: [
        { filename: { $regex: query, $options: 'i' } },
        { originalName: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    })
      .sort({ uploadedAt: -1 })
      .limit(limit)
      .lean();

    return results.map(formatMediaResponse);
  } catch (e) {
    console.error('Failed to search media:', e);
    return [];
  }
}

/**
 * Get file extension
 */
function getFileExtension(filename?: string): string {
  if (!filename) return '';
  const match = filename.match(/\.[^.]*$/);
  return match ? match[0] : '';
}

/**
 * Format media response
 */
function formatMediaResponse(media: any): MediaFile {
  return {
    _id: media._id?.toString(),
    filename: media.filename,
    originalName: media.originalName,
    mimeType: media.mimeType,
    size: media.size,
    publicUrl: media.publicUrl,
    uploadedAt: media.uploadedAt,
    dimensions: media.dimensions,
    usedBy: media.usedBy,
  };
}
