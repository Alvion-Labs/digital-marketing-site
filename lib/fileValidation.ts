/**
 * File upload validation utilities
 */

// Allowed MIME types for media uploads
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

// Allowed file extensions
const ALLOWED_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'svg',
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
];

// Max file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate uploaded file
 */
export function validateFileUpload(
  file: { name: string; type: string; size?: number },
  fileBuffer?: Buffer
): FileValidationResult {
  // Check file name
  if (!file.name || typeof file.name !== 'string') {
    return { valid: false, error: 'Invalid filename' };
  }

  // Get file extension
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `File type .${ext} not allowed` };
  }

  // Check MIME type
  const mimeType = file.type || 'application/octet-stream';
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return { valid: false, error: `MIME type ${mimeType} not allowed` };
  }

  // Check file size (max 50MB)
  if (fileBuffer && fileBuffer.length > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 50MB limit' };
  }

  // Prevent directory traversal
  if (file.name.includes('/') || file.name.includes('\\') || file.name.includes('..')) {
    return { valid: false, error: 'Invalid filename format' };
  }

  // Prevent common malicious filenames
  const maliciousPatterns = ['.exe', '.bat', '.cmd', '.sh', '.dll', '.so'];
  if (maliciousPatterns.some(pattern => file.name.toLowerCase().includes(pattern))) {
    return { valid: false, error: 'Potentially malicious file not allowed' };
  }

  return { valid: true };
}

/**
 * Get safe file extension
 */
export function getSafeFileName(originalName: string): string {
  // Remove directory paths
  let safeName = originalName.split(/[/\\]/).pop() || 'file';
  // Remove special characters except dots and hyphens
  safeName = safeName.replace(/[^\w.-]/g, '_');
  // Remove leading dots
  safeName = safeName.replace(/^\.+/, '');
  return safeName;
}
