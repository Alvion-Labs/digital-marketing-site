import Container from '@/components/global/Container';
import Link from 'next/link';
import Badge from '@/components/global/Badge';

const services = [
  {
    checkClass: 'text-cyan-300',
    title: 'Social Media Marketing',
    tagline: 'Build a brand that people talk about',
    description:
      'From account management to content creation and performance tracking, we help your brand grow on Instagram, Facebook, and LinkedIn through engaging content and consistent posting.',
    details: [
      'Platform-specific content calendars tailored to your brand voice',
      'Consistent posting schedules optimized for maximum engagement',
      'Performance analytics with monthly reports and actionable insights',
      'Community management and audience engagement strategies',
      'Influencer collaboration and partnership outreach',
      'A/B tested creatives and copy for better reach',
    ],
    features: ['Content Planning', 'Platform Management', 'Analytics'],
    thumbnail: '/Content Images/Social media Marketing Thumnail.webp',
    icons: null,
  },
  {
    checkClass: 'text-lime-300',
    title: 'SEO',
    tagline: 'Get found when it matters most',
    description:
      'We help your website rank higher on Google through technical audits, keyword research, on-page optimization, and link building to improve visibility and bring in more organic traffic.',
    details: [
      'In-depth keyword research targeting high-intent search terms',
      'Technical SEO audits to fix crawl errors and improve site health',
      'On-page optimization including meta tags, headers, and content',
      'Quality link building from authoritative industry sources',
      'Local SEO for businesses targeting specific geographic areas',
      'Monthly ranking reports and performance tracking',
    ],
    features: ['Keyword Research', 'Technical SEO', 'Link Building'],
    thumbnail: '/Content Images/Seo Thumbnail.webp',
    icons: null,
  },
  {
    checkClass: 'text-sky-300',
    title: 'Website Development',
    tagline: 'Fast, Beautiful and Built to convert',
    description:
      'We design fast, responsive websites with clean UI/UX and conversion-focused funnels that load quickly and turn visitors into leads.',
    details: [
      'Custom responsive designs optimized for all devices',
      'Performance-first development with sub-2s load times',
      'SEO-friendly structure and semantic markup from day one',
      'Lead capture forms and conversion-focused call-to-actions',
      'CMS integration so you can manage content yourself',
      'Ongoing maintenance and security updates',
    ],
    features: ['Responsive Design', 'Fast Performance', 'Lead Conversion'],
    thumbnail: '/Content Images/web development Thumbnail.webp',
    icons: null,
  },
  {
    checkClass: 'text-orange-300',
    title: 'Paid Advertising',
    tagline: 'Ads that deliver the best ROI',
    description:
      'Maximize your ad spend with targeted paid campaigns built to generate leads, sales, and measurable brand awareness.',
    details: [
      'Campaign strategy aligned with your business goals and budget',
      'Advanced audience targeting including lookalikes and retargeting',
      'Ad creative development with copy and visual assets',
      'Multi-platform management (Google Ads, Meta, LinkedIn)',
      'Real-time campaign optimization and bid management',
      'Detailed ROI reporting with actionable recommendations',
    ],
    features: ['Campaign Setup', 'Audience Targeting', 'ROI Tracking'],
    thumbnail: null,
    icons: ['/logos/google 3d.png', '/logos/meta 3d.png'],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50/50 py-24 md:py-32">
        <Container>
          <div className="max-w-4xl text-center mx-auto">
            <Badge ariaLabel="section label">Our Services</Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 mb-6">
              Everything you need to{' '}
              <span className="gradient-text">grow online</span>
            </h1>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              From social media to paid ads, web development to SEO, we provide everything a brand needs to grow online, reach the right audience, and generate quality leads.
            </p>
          </div>
        </Container>
      </section>

      <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent w-full" />

      {/* Section heading between hero and services */}
      <div className="pt-16 pb-6 bg-white">
        <Container>
          <div className="text-center">
            <Badge ariaLabel="section label" className="mb-2">What we offer</Badge>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-gray-900">
              Our Services
            </h2>
          </div>
        </Container>
      </div>

      {/* Services Detail */}
      {services.map((service, index) => (
        <div key={service.title}>
          <section className={`py-20 md:py-28 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
            <Container>
              <div
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center gap-10 lg:gap-16`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  {service.icons ? (
                    <div className="relative w-full rounded-[2.5rem] bg-gray-50/80 overflow-hidden">
                      <div className="aspect-4/3 relative flex items-center justify-center gap-6 p-12">
                        {service.icons.map((icon) => (
                          <img
                            key={icon}
                            src={icon}
                            alt=""
                            className="h-28 w-28 sm:h-36 sm:w-36 object-contain transition-transform duration-500 hover:scale-[1.06]"
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-[0_2px_16px_-6px_rgba(0,0,0,0.06)]">
                      <div className="aspect-4/3 relative">
                        <img
                          src={service.thumbnail}
                          alt={service.title}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2 flex flex-col space-y-5">
                  <div>
                    <span
                      className="inline-flex items-center gap-2 rounded-full border border-accent-from/15 bg-linear-to-r from-accent-from/8 via-white to-accent-to/8 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-from shadow-sm shadow-accent-from/5"
                    >
                      <span className="h-2 w-2 rounded-full bg-linear-to-r from-accent-from to-accent-to" />
                      {service.title}
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                    {service.tagline}
                  </h2>
                  <p className="text-gray-700 text-base leading-7">
                    {service.description}
                  </p>

                  <ul className="space-y-3 pt-2">
                    {service.details.map((detail, i) => (
                      <li key={detail} className="flex items-start gap-3.5">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent-from/12 bg-linear-to-br from-accent-from/10 to-accent-to/10 text-[11px] font-extrabold text-accent-from ring-1 ring-accent-from/8">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="text-gray-700 text-sm leading-6">{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {service.features.map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center rounded-full border border-accent-from/10 bg-accent-from/5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-accent-from"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Get Started button - below the row, right-aligned */}
              <div className="flex justify-end pt-20">
                <Link
                  href="/#contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-linear-to-r from-accent-from to-accent-to px-6 py-3 text-sm font-semibold text-white shadow-md shadow-accent-from/15 hover:shadow-lg hover:shadow-accent-from/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            </Container>
          </section>

          {/* Horizontal divider between sections */}
          {index < services.length - 1 && (
            <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent w-full" />
          )}
        </div>
      ))}

      {/* Call to Action */}
      <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent w-full" />
      <section className="py-20 bg-gray-50/70">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to grow your business?
            </h2>
            <p className="text-gray-700 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Let’s talk about your vision and create a plan that fits your budget and timeline to bring it to life with the best solutions.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-accent-from to-accent-to px-8 py-4 text-base font-semibold text-white shadow-lg shadow-accent-from/20 hover:shadow-xl hover:shadow-accent-from/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Get in touch with our team
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}