# ✅ reCAPTCHA v2 Integration - COMPLETE

This document describes the implemented Google reCAPTCHA v2 (checkbox) flow for both lead submissions and blog suggestion submissions.

---

## Implementation Flow

### Request Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        USER INTERACTION                          │
│  (Contact Form / Blog Suggestion Form)                           │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                     CLIENT-SIDE (Browser)                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Form Component Renders:                                     │
│     ├─ Contact.tsx or BlogRatingComponent.tsx                   │
│     └─ Initializes: captchaToken = null                         │
│                                                                  │
│  2. RecaptchaV2 Widget Component:                               │
│     ├─ Loads Google's reCAPTCHA script                          │
│     ├─ Renders checkbox widget with siteKey                    │
│     └─ User checks: "I'm not a robot"                          │
│                                                                  │
│  3. On Token Reception:                                         │
│     ├─ onVerify() callback fired                               │
│     ├─ Token stored in React state                             │
│     └─ Submit button ENABLED                                   │
│                                                                  │
│  4. On Form Submit:                                             │
│     ├─ Validation checks pass                                  │
│     ├─ JSON payload includes: captchaToken                     │
│     └─ POST to /api/leads or /api/blog-suggestions             │
│                                                                  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       │ (HTTPS POST with captchaToken)
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                    SERVER-SIDE (Node.js)                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Route Handler: /api/leads or /api/blog-suggestions            │
│                                                                  │
│  1. Rate Limit Check:                                           │
│     ├─ Extract client IP via X-Forwarded-For                   │
│     ├─ Check against in-memory rate limit store                │
│     └─ Return 429 if exceeded (5 req/hr for leads)             │
│                                                                  │
│  2. Extract captchaToken from body:                             │
│     ├─ If missing → Return 400                                 │
│     └─ Proceed if present                                      │
│                                                                  │
│  3. Load reCAPTCHA Secret:                                      │
│     ├─ From env: RECAPTCHA_SECRET or RECAPTCHA_V2_SECRET      │
│     ├─ If missing → Log error, return 500                      │
│     └─ Proceed if present                                      │
│                                                                  │
│  4. Verify Token with Google:                                   │
│     ├─ POST to: https://www.google.com/recaptcha/api/siteverify
│     ├─ Body: { secret, response: captchaToken, remoteip }     │
│     └─ Wait for Google's response                              │
│                                                                  │
│  5. Parse Verification Response:                                │
│     ├─ { success: true/false, challenge_ts, ... }             │
│     ├─ If success=false → Return 401                          │
│     └─ If success=true → Continue to business logic           │
│                                                                  │
│  6. Create Record (Lead or BlogSuggestion):                    │
│     ├─ Validate form fields (email, name, etc)                │
│     ├─ Save to MongoDB                                         │
│     ├─ Send confirmation email (for leads)                     │
│     └─ Return 201 with success response                        │
│                                                                  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                   RESPONSE TO CLIENT                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Success (201):                                                 │
│  {                                                              │
│    "success": true,  // or "ok": true for suggestions          │
│    "id": "mongo_id"                                            │
│  }                                                              │
│                                                                  │
│  Errors:                                                        │
│  - 400: Missing captchaToken                                   │
│  - 401: Captcha verification failed                            │
│  - 429: Too many requests (rate limited)                       │
│  - 500: Server error (missing secret, DB error, etc)          │
│                                                                  │
│  Client-side on success:                                        │
│  ├─ Reset form fields                                          │
│  ├─ Reset captcha widget                                       │
│  ├─ Clear token state                                          │
│  └─ Show success message                                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## System Components

### Overview
- **Client Widget:** `components/global/RecaptchaV2.tsx` — wraps the official `react-google-recaptcha` package for type-safe usage.
- **Forms updated:** `components/pages/home/Contact.tsx` and `components/pages/blog/BlogRatingComponent.tsx` now render the widget and include `captchaToken` in POST payloads.
- **Server verification:** `app/api/leads/route.ts` and `app/api/blog-suggestions/route.ts` verify tokens with Google before creating records.

---

## Package Installation

### Dependencies Added

```bash
npm install react-google-recaptcha @types/react-google-recaptcha
```

### Why `react-google-recaptcha`?
- ✅ **Official & battle-tested** — Google-maintained package with thousands of production users
- ✅ **Type-safe** — Full TypeScript support with `@types/react-google-recaptcha`
- ✅ **Proper error handling** — Built-in token expiration, error callbacks, reset functionality
- ✅ **React best practices** — Uses hooks, proper cleanup, memory leak prevention
- ✅ **Security** — Handles script injection safely, avoids manual `window.grecaptcha` access
- ✅ **Accessibility** — Google's package includes WCAG compliance features
- ✅ **Browser compatibility** — Tested across all major browsers

---

### Required Environment Variables

| Variable | Purpose | Scope | Example |
|----------|---------|-------|---------|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Client-side site key for widget rendering | Frontend (public) | `6LcpavssAAAAACJlySNPrUVbHnIKffeVeKj8I-jZ` |
| `RECAPTCHA_SECRET` | Server-side secret for token verification | Backend (private) | `6LcpavssAAAAAGFmuISlny_5ODCTL5Y9X6u1S7RT` |

### Setup

Add to `.env.local`:

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET=your_secret_here
```

**Security:** Keep `RECAPTCHA_SECRET` in `.env.local` and never commit to source control. Use proper secret management (Vercel Secrets, HashiCorp Vault, etc.) in production.

---

## Detailed Behavior

### Client-Side Flow
1. **Widget Initialization:** `RecaptchaV2` component wraps the official `react-google-recaptcha` package and exposes a `ref` for manual widget control.
2. **User Interaction:** User clicks "I'm not a robot" checkbox. Google verifies user behavior silently.
3. **Token Generation:** On successful verification, Google passes a `captchaToken` to `onVerify()` callback.
4. **Button State:** Submit button transitions from disabled → enabled when token received.
5. **Form Submission:** On click, client sends form data + `captchaToken` in JSON body to API.
6. **Widget Reset (Security):** After successful submission:
   - Form fields are cleared
   - Captcha widget is explicitly reset via `ref.current?.reset()` (clears checkbox and internal token)
   - Token state is cleared for next attempt
   - **Important:** User must complete captcha again for next submission (prevents token reuse)
   - This is a security best practice to ensure fresh verification for each submission

### Server-Side Flow
1. **Extract Token:** Route handler retrieves `captchaToken` from JSON body.
   - Returns `400` if missing.
2. **Load Secret:** Retrieves `RECAPTCHA_SECRET` from environment.
   - Returns `500` if missing or misconfigured.
3. **Call Google Verification API:** POSTs to `https://www.google.com/recaptcha/api/siteverify` with:
   - `secret`: server secret from environment
   - `response`: captcha token from client
   - `remoteip`: client IP address (for fraud analysis)
4. **Parse Response:** Google returns `{ success: true/false, challenge_ts, hostname, ... }`.
   - Returns `401` if verification failed.
   - Proceeds to business logic if `success=true`.
5. **Create Record:** Validate remaining fields and create Lead/BlogSuggestion in MongoDB.
6. **Return Result:** Returns `201` on success with record ID.

---

## Files Modified & Created

### New Files
| File | Purpose |
|------|---------|
| `components/global/RecaptchaV2.tsx` | Type-safe wrapper around `react-google-recaptcha` package |

### Modified Client Components
| File | Changes |
|------|---------|
| `components/pages/home/Contact.tsx` | Added RecaptchaV2 widget via official package, state for captchaToken, include token in POST payload |
| `components/pages/blog/BlogRatingComponent.tsx` | Added RecaptchaV2 widget via official package, state for captchaToken, include token in POST payload |

### Modified Server Routes
| File | Changes |
|------|---------|
| `app/api/leads/route.ts` | Added reCAPTCHA token verification before creating leads |
| `app/api/blog-suggestions/route.ts` | Added reCAPTCHA token verification before creating suggestions |

### Enhanced Client Behavior
- Submit buttons disabled until `captchaToken` received
- Token included in request JSON body as `captchaToken` field
- Widget reset after successful submission
- Error handling for missing/failed captcha verification

### Enhanced Server Behavior
- Early validation of `captchaToken` (returns 400 if missing)
- Verification call to Google's API with secret
- Returns 401 on verification failure (invalid/expired token)
- IP-based rate-limiting remains as secondary defense
- Generic error messages to avoid info leaks

---

## Testing Checklist

### ✅ Local Development
- [ ] Add keys to `.env.local`
- [ ] Restart dev server: `npm run dev`
- [ ] Navigate to **Contact** form and verify reCAPTCHA checkbox appears
- [ ] Navigate to a **blog page** and verify reCAPTCHA appears in suggestion form
- [ ] Check box on Contact form and verify submit button becomes enabled
- [ ] Submit contact form with valid data and verify:
  - Success message displays
  - No console errors
  - Network tab shows `201` response
  - Checkbox resets after success
- [ ] Submit blog suggestion with valid data and verify similar success flow
- [ ] Try submitting **without** checking captcha and verify submit button stays disabled
- [ ] Inspect network to confirm `captchaToken` is included in request body

### ✅ Error Handling
- [ ] Test with **missing** `captchaToken` (simulate by patching form):
  - Expect: `400` error from server
  - User sees: generic error message
- [ ] Test with **expired/invalid** token:
  - Expect: `401` error from server
  - User sees: generic error message
- [ ] Test with **missing env vars**:
  - Stop server, remove `RECAPTCHA_SECRET` from `.env.local`, restart
  - Submit form and expect: `500` error
  - Check server logs for "reCAPTCHA secret not configured"

### ✅ Rate Limiting
- [ ] Submit contact form **5+ times** within 1 hour from same IP:
  - Expect: `429` error after 5 requests
- [ ] Verify error message: "Too many submissions. Please try again later."

### ✅ Security Checks
- [ ] Confirm `RECAPTCHA_SECRET` **not exposed** in network requests
- [ ] Confirm `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is visible (expected in client code)
- [ ] Verify token is **unique** per submission (token changes on checkbox re-completion)
- [ ] Verify token **not reusable** (submit same token twice → second fails)

---

## Security Considerations

### ✅ Implemented Safeguards

| Safeguard | Implementation |
|-----------|-----------------|
| **Server-side verification** | Token verified on server before any action; client-side token alone insufficient |
| **Explicit widget reset** | After each successful submission, captcha widget is reset via ref to prevent token reuse |
| **Token state cleared** | React state is cleared so submit button disables again, forcing fresh captcha |
| **Secret protection** | `RECAPTCHA_SECRET` kept server-side; never exposed in network/client code |
| **Rate limiting** | IP-based limits (5 reqs/hr for leads, 10/hr for suggestions) + captcha checks |
| **Generic errors** | Server returns generic error messages; no provider details leaked |
| **Token binding** | Tokens tied to client IP via Google's verification (remoteip parameter) |
| **Environment isolation** | Secrets stored in `.env.local` (development) and secure secret managers (production) |
| **HTTPS only** | Client sends token over secure connection to Google and your server |

### 🔒 Recommendations for Production

1. **Use secure secret management:**
   - Vercel Secrets for Vercel deployments
   - AWS Secrets Manager / HashiCorp Vault for self-hosted
   - Never hardcode secrets in `.env` files in production

2. **Add monitoring & logging:**
   - Log failed captcha attempts (count, timestamp, IP pattern)
   - Alert on sudden spike in failed verifications (potential attack)
   - Track success rate to tune user experience

3. **Monitor user experience:**
   - Track false positive rate (humans failing captcha)
   - If >5% humans fail, consider switching to v3 or reducing verification strictness

4. **Add honeypot field (optional):**
   - Hidden form field that should remain empty
   - Bots fill it; legitimate users don't
   - Add server-side check: if honeypot filled, reject as spam

5. **Consider fallback provider:**
   - hCaptcha or Cloudflare Turnstile for privacy-conscious users
   - Let users choose privacy-preserving alternative on landing

6. **Audit & Security:**
   - Regularly review reCAPTCHA security documentation
   - Keep dependencies updated (Next.js, Node.js)
   - Perform penetration testing before production launch

### ⚠️ Known Limitations

- **v2 Checkbox:** Relies on user interaction; less sophisticated than v3 (score-based)
- **Accessibility:** Captcha can be challenging for users with disabilities (but Google provides audio alternatives)
- **Privacy:** Google collects verification data; review privacy policy and update your site's privacy notice
- **Token expiration:** Tokens from Google expire after ~120 seconds; quick resubmits must re-complete captcha
