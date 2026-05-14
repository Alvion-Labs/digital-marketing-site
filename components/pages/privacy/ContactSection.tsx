'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ContactSectionProps {
  contactEmail: string;
  contactWebsite: string;
}

function ensureProtocol(url: string): string {
  if (!url) return '';
  return url.match(/^https?:\/\//) ? url : `https://${url}`;
}

export default function ContactSection({ contactEmail, contactWebsite }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);

  const websiteHref = ensureProtocol(contactWebsite);
  const websiteDisplay = contactWebsite.replace(/^https?:\/\//, '');

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = contactEmail;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-14">
      <div className="pt-4">
        <h3 className="text-2xl font-bold text-gray-900">Contact Us</h3>
        <p className="mt-1 text-sm text-gray-500">
          If you have questions or concerns about this privacy policy, feel free to reach out.
        </p>

        <Link href="/" aria-label="Alvion Digital Marketing" className="inline-block mt-4">
          <Image
            src="/Alvion%20Logo%20landsacpe.png"
            alt="Alvion Digital Marketing"
            width={220}
            height={63}
            className="h-12 w-auto"
          />
        </Link>

        <div className="mt-1 space-y-2">
          {contactEmail && (
            <div className="inline-flex items-center gap-0">
              <a
                href={`mailto:${contactEmail}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-700"
              >
                {contactEmail}
              </a>
              <button
                onClick={copyEmail}
                className="inline-flex items-center justify-center px-2 py-1 text-gray-400 transition-colors hover:text-gray-600"
                title={copied ? 'Copied!' : 'Copy email address'}
                aria-label="Copy email address"
              >
                {copied ? (
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                )}
              </button>
            </div>
          )}
          {contactWebsite && (
            <div>
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent-to underline underline-offset-2 transition-colors hover:text-accent-from"
              >
                {websiteDisplay}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}