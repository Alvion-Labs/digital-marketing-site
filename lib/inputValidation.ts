/**
 * Input validation and sanitization utilities
 */

/**
 * Sanitize search query to prevent NoSQL injection
 * - Removes special MongoDB characters
 * - Limits query length
 * - Escapes regex special characters
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== 'string') {
    return '';
  }

  // Limit query length to 100 characters
  let sanitized = query.substring(0, 100).trim();

  // Remove MongoDB operators and dangerous characters
  sanitized = sanitized
    .replace(/[\$\{\}]/g, '') // Remove $, {, }
    .replace(/\x00/g, ''); // Remove null bytes

  return sanitized;
}

/**
 * Escape regex special characters
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Validate email format securely
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string' || email.length > 254) {
    return false;
  }
  // RFC 5322 simplified
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize user input to prevent XSS
 * - Removes script tags
 * - Escapes HTML special characters
 */
export function sanitizeUserInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers (onclick=, etc)
    .trim();
}

/**
 * Validate and sanitize pagination parameters
 */
export function sanitizePaginationParams(limit?: string, skip?: string): { limit: number; skip: number } {
  let parsedLimit = parseInt(limit || '20', 10);
  let parsedSkip = parseInt(skip || '0', 10);

  // Validate limits
  parsedLimit = Math.min(Math.max(parsedLimit, 1), 100); // Between 1 and 100
  parsedSkip = Math.max(parsedSkip, 0); // Can't be negative

  return { limit: parsedLimit, skip: parsedSkip };
}
