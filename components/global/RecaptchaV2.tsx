'use client';

import { useRef, forwardRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface RecaptchaV2Props {
  siteKey: string;
  onVerify: (token: string | null) => void;
  theme?: 'light' | 'dark';
}

export interface RecaptchaV2Handle {
  reset: () => void;
}

const RecaptchaV2 = forwardRef<RecaptchaV2Handle, RecaptchaV2Props>(
  ({ siteKey, onVerify, theme = 'light' }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    // Expose reset method via ref
    const reset = () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
        onVerify(null);
      }
    };

    // Forward the reset method to parent component
    if (ref && typeof ref === 'object') {
      ref.current = { reset };
    }

    if (!siteKey) {
      return null; // Don't render if no site key
    }

    return (
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={(token) => onVerify(token)}
        theme={theme}
      />
    );
  }
);

RecaptchaV2.displayName = 'RecaptchaV2';

export default RecaptchaV2;
