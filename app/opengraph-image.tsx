import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Alvion Digital Marketing';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  const logoUrl = 'https://alviondigital.in/Alvion%20Logo%20landsacpe.png';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 45%, #eef2ff 100%)',
          position: 'relative',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 1040,
            height: 420,
            borderRadius: 36,
            background: 'rgba(255,255,255,0.9)',
            boxShadow: '0 24px 80px rgba(15, 23, 42, 0.12)',
            padding: 56,
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 48,
            border: '1px solid rgba(148, 163, 184, 0.22)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 620 }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                letterSpacing: -2,
                color: '#0f172a',
                lineHeight: 1,
              }}
            >
              Alvion Digital Marketing
            </div>
            <div
              style={{
                fontSize: 30,
                lineHeight: 1.35,
                color: '#475569',
                maxWidth: 560,
              }}
            >
              Social media, SEO, and websites that grow your business.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              width: 320,
              height: 150,
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img
              src={logoUrl}
              alt="Alvion Digital Marketing logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
