/**
 * CORS configuration for public APIs
 */

export function getCorsHeaders(origin?: string): Record<string, string> {
  // Only allow requests from your own domain
  const allowedOrigins = [
    'https://alviondigital.in',
    'https://www.alviondigital.in',
    'http://localhost:3000', // For development
  ];

  const originToUse = origin && allowedOrigins.includes(origin) ? origin : 'https://alviondigital.in';

  return {
    'Access-Control-Allow-Origin': originToUse,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

export function handleCorsOptions(request: Request): Response {
  const origin = request.headers.get('origin') || '';
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}
