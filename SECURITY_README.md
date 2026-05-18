# Security README

## Current Scan Status (18 May 2026)

- Build: ✅ passing
- TypeScript: ✅ passing
- Dependency audit (`npm audit --audit-level=moderate`):
  - Critical: **0**
  - High: **0**
  - Moderate: **2** (transitive `next`/`postcss` advisory chain)

## Security Hardening Implemented

### 1) Platform and dependency updates
- Updated `next` to `16.2.6`
- Updated `sanitize-html` to latest safe release
- Updated `@vercel/blob` to `2.3.3`

### 2) Edge security layer
- Migrated deprecated middleware convention to Next.js 16 proxy convention:
  - removed `middleware.ts`
  - added `proxy.ts`
- Added/kept security headers in `proxy.ts`:
  - `Content-Security-Policy`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy`
  - `Strict-Transport-Security` in production
- CSP behavior:
  - production: strict (no `unsafe-eval`)
  - development: allows `unsafe-eval` for React dev stack traces

### 3) Admin authentication hardening
Files: `lib/admin.ts`, `app/api/admin/auth/route.ts`

- Replaced plain cookie trust (`admin_session=authenticated`) with signed session tokens using HMAC SHA-256.
- Added helpers:
  - `createAdminSessionToken()`
  - `verifyAdminSessionToken()`
- Updated all admin session checks to verify signature instead of checking raw cookie string.
- Added auth endpoint rate limiting (login attempts per IP).

### 4) Public form abuse protection
Files: `lib/rateLimit.ts`, `app/api/leads/route.ts`

- Added IP-based rate limiting for lead submissions.
- Returns HTTP `429` when limit is exceeded.

### 5) CORS policy for public lead endpoint
Files: `lib/cors.ts`, `app/api/leads/route.ts`

- Added explicit CORS allowlist.
- Implemented `OPTIONS` preflight handling.

### 6) Upload security controls
Files: `lib/fileValidation.ts`, `app/api/admin/media/route.ts`

- Added file type and extension allowlist.
- Added file size limit.
- Added filename sanitization checks (directory traversal and dangerous patterns).
- Rejects invalid upload requests with `400`.

### 7) Query/input hardening
Files: `lib/inputValidation.ts`, `app/api/admin/media/route.ts`

- Added search query sanitization.
- Added pagination parameter sanitization.

### 8) Rich text sanitization tightening
File: `lib/html.ts`

- Replaced permissive style rules with strict CSS property/value allowlist.
- Kept URL scheme restrictions for links and images.

## Remaining Items

1. `npm audit` still reports **2 moderate** vulnerabilities through the `next` -> `postcss` advisory chain. No direct critical/high issues remain.
2. Secret rotation is intentionally excluded (per project instruction): credentials in `.env.local` should still be rotated outside code changes.

## Quick Verification Commands

```bash
npm run build
npx tsc --noEmit
npm audit --audit-level=moderate
```
