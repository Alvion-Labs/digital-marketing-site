import type { Metadata } from 'next';
import Container from '@/components/global/Container';
import ContactSection from '@/components/pages/privacy/ContactSection';
import { sanitizeBlogHtml } from '@/lib/html';
import { getPrivacyPolicy } from '@/lib/privacyPolicy';

export const metadata: Metadata = {
  title: 'Privacy Policy | Alvion Digital Marketing',
  description: 'Read the privacy policy for Alvion Digital Marketing.',
};

function ensureProtocol(url: string): string {
  return url.match(/^https?:\/\//) ? url : `https://${url}`;
}

export default async function PrivacyPolicyPage() {
  const policy = await getPrivacyPolicy();
  const safeContent = sanitizeBlogHtml(policy.contentHTML || '');
  const contactEmail = policy.contactEmail || '';
  const contactWebsite = policy.contactWebsite || '';
  const policyWebsite = policy.contactWebsite || '';
  const intro = policy.intro || '';

  return (
    <>
      <main className="pt-16 md:pt-20 bg-white">
        <section className="py-14 md:py-20 border-b border-gray-100">
          <Container>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Privacy Policy</h1>

              {policyWebsite && (
                <p className="mt-4 text-sm text-gray-500">
                  Website:{' '}
                  <a
                    href={ensureProtocol(policyWebsite)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-to underline underline-offset-2 hover:text-accent-from transition-colors"
                  >
                    {policyWebsite.replace(/^https?:\/\//, '')}
                  </a>
                </p>
              )}

              {policy.effectiveDate && (
                <p className="mt-1 text-sm text-gray-500">
                  Last updated: {policy.effectiveDate}
                </p>
              )}

              {intro && (
                <p className="mt-4 text-sm text-gray-600 leading-relaxed max-w-2xl">
                  {intro}
                </p>
              )}
            </div>
          </Container>
        </section>

        <section className="py-10 md:py-14">
          <Container>
            <article className="max-w-4xl mx-auto blog-content" dangerouslySetInnerHTML={{ __html: safeContent }} />
            {(contactEmail || contactWebsite) && (
              <ContactSection contactEmail={contactEmail} contactWebsite={contactWebsite} />
            )}
          </Container>
        </section>
      </main>
    </>
  );
}