'use client';

import ReCAPTCHA from 'react-google-recaptcha';

interface RecaptchaV2Props {
  siteKey: string;
  onVerify: (token: string | null) => void;
  theme?: 'light' | 'dark';
}

export default function RecaptchaV2({ siteKey, onVerify, theme = 'light' }: RecaptchaV2Props) {
  if (!siteKey) {
    return null; // Don't render if no site key
  }

  return (
    <ReCAPTCHA
      sitekey={siteKey}
      onChange={(token) => onVerify(token)}
      theme={theme}
    />
  );
}
