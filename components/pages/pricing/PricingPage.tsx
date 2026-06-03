import Image from 'next/image';
import Container from '@/components/global/Container';
import Badge from '@/components/global/Badge';
import Button from '@/components/global/Button';

const paymentSteps = [
  {
    label: '1',
    title: 'Project kickoff',
    description:
      'To begin work, clients pay one-third of the first two-week service fee in advance. This confirms the engagement and starts onboarding, strategy, and execution.',
  },
  {
    label: '2',
    title: 'Two-week delivery and billing cycles',
    description:
      'Our services run on a two-week billing cycle. Work completed during each cycle is reviewed and invoiced at the end of that period.',
  },
  {
    label: '3',
    title: 'Electronic invoicing',
    description:
      'Invoices are shared electronically with clear service details so you always know what was delivered and what is due next.',
  },
  {
    label: '4',
    title: 'Ongoing partnership',
    description:
      'As your goals evolve, we adjust the scope, strategy, and budget to match your business needs without forcing fixed packages.',
  },
];

const pricingFactors = [
  'Services required',
  'Project scope',
  'Advertising budget',
  'Business goals',
  'Campaign complexity',
  'Timeline and execution depth',
];

const paymentMethods = [
  {
    key: 'UPI',
    label: 'UPI',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="2" y="5" width="20" height="14" rx="2" fill="#fff" />
        <path d="M7 9h10M7 12h6" stroke="#1a1054" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'debit',
    label: 'Debit Cards',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="2" y="6" width="20" height="12" rx="2" stroke="#1a1054" strokeWidth="1.2" fill="#fff" />
        <path d="M3 9h18" stroke="#1a1054" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'credit',
    label: 'Credit Cards',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="#1a1054" strokeWidth="1.2" fill="#fff" />
        <circle cx="8" cy="12" r="1.6" fill="#1a1054" />
        <path d="M16 11v2" stroke="#1a1054" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'mastercard',
    label: 'Mastercard & major cards',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="9" cy="12" r="3.2" fill="#f59e0b" />
        <circle cx="15" cy="12" r="3.2" fill="#ef4444" />
      </svg>
    ),
  },
];

export default function PricingPage() {
  return (
    <main className="bg-white pt-16 md:pt-20">
      <section className="relative overflow-hidden bg-gray-50/50 py-24 md:py-32">
        <Container>
          <div className="relative max-w-6xl mx-auto text-left">
            <Badge ariaLabel="section label" className="mb-8">Pricing & Payment Process</Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-gray-900">
              <span>Simple, Transparent, and </span>
              <span className="gradient-text">Built Around Your Goals</span>
            </h1>

            <div className="grid items-center lg:items-start gap-10 lg:grid-cols-2">
              <div>
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl lg:mx-0">
                  Great marketing starts with understanding your business. That&apos;s why every proposal is customized around your goals, priorities, and the work required to achieve them.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-start gap-4">
                  <Button variant="secondary" size="lg" href="/services" className="w-full sm:w-auto">
                    View services
                  </Button>
                  <Button variant="primary" size="lg" href="/#contact" className="w-full sm:w-auto">
                    Request a custom proposal
                  </Button>
                </div>
              </div>

                <div className="hidden lg:flex lg:items-start lg:justify-end">
                  <div className="relative rounded-[1rem] overflow-hidden shadow-lg w-[380px] -mt-6 -ml-6 lg:-mt-10 lg:-ml-10">
                    <Image
                      src="/Content Images/Pricing Thumbnail.webp"
                      alt="Pricing thumbnail"
                      width={570}
                      height={380}
                      className="w-full h-auto object-cover"
                      priority
                    />
                  </div>
                </div>
            </div>
          </div>
        </Container>
      </section>

      <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

      <section className="py-20 md:py-28 bg-white">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <Badge ariaLabel="section label" className="mb-6">How it works</Badge>
              <h2 className="mt-0 text-3xl md:text-4xl font-extrabold text-gray-900">
                A simple billing structure that keeps work and payment aligned
              </h2>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {paymentSteps.map((step, idx) => (
                <div
                  key={`${step.title}-${idx}`}
                  className="relative rounded-[1.75rem] border border-gray-200 bg-linear-to-b from-white to-gray-50/80 p-6 hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 overflow-hidden"
                >
                  {/* Decorative curved top overlay using SVG */}
                  <svg
                    aria-hidden
                    className="absolute inset-0 w-full h-full pointer-events-none -z-0"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id={`grad-step-${idx}`} x1="0" x2="1">
                        <stop offset="0%" stopColor="#eef2ff" stopOpacity="0.06" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 18 C18 0 82 0 100 18 L100 100 L0 100 Z" fill={`url(#grad-step-${idx})`} />
                  </svg>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-r from-accent-from/6 to-accent-to/6 text-sm font-bold text-accent-from backdrop-blur-md">
                    {step.label}
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-700">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Button href="/#contact" variant="primary" size="lg" className="w-full sm:w-auto">
                Book free consultation
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />

      <section className="py-20 md:py-28 bg-gray-50/60">
        <Container>
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start max-w-6xl mx-auto">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
              <Badge ariaLabel="section label" className="mb-0">Accepted payment methods</Badge>
              <h2 className="mt-3 text-3xl font-extrabold text-gray-900">Flexible ways to pay</h2>
              <p className="mt-4 text-sm leading-6 text-gray-700">
                We currently accept payments through the methods below. If your team needs a specific invoicing setup,
                we can discuss it during onboarding.
              </p>

              <div className="mt-6 space-y-3">
                {paymentMethods.map((m) => (
                  <div
                    key={m.key}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="shrink-0 flex items-center justify-center h-9 w-9 rounded-lg bg-linear-to-r from-accent-from/10 to-accent-to/10 text-accent-from">
                        {m.icon}
                      </div>
                      <span className="font-medium text-gray-900">{m.label}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-accent-from transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Badge ariaLabel="section label" className="mb-0">Custom pricing</Badge>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-gray-900">
                Every proposal is built around the work required
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-7 text-gray-700">
                Final pricing depends on the services included, the project scope, your advertising budget,
                your business goals, and the complexity of the campaign. That gives us enough room to build a
                plan that matches what the work actually needs rather than forcing a generic package.
              </p>

              {/* Pricing factors removed per request */}

              <div className="mt-8 rounded-[1.75rem] bg-linear-to-r from-accent-from to-accent-to p-6 md:p-8 text-white shadow-[0_18px_60px_-28px_rgba(37,95,241,0.55)]">
                <h3 className="text-2xl font-bold">Need a tailored estimate?</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90">
                  Share your goals, services, and timeline with us, and we’ll prepare a customized proposal that fits your
                  business stage and marketing priorities.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                  <Button variant="secondary" size="lg" href="/#contact" className="w-full sm:w-auto">
                    Contact our team
                  </Button>
                  <Button variant="outline" size="lg" href="/services" className="w-full sm:w-auto text-white border-white/25">
                    Explore services
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}