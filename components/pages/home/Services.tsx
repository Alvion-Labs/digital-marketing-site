import Container from '@/components/global/Container';
import Button from '@/components/global/Button';
import Badge from '@/components/global/Badge';

type Service = {
  title: string;
  description: string;
  features: string[];
  thumbnail: string;
};

const services: Service[] = [
  {
    title: 'Social Media Marketing',
    description:
      'From account management to content creation and performance tracking, we help your brand grow on Instagram, Facebook, and LinkedIn through engaging content and consistent posting.',
    features: ['Content Planning', 'Platform Management', 'Analytics'],
    thumbnail: '/Content Images/Social media Marketing Thumnail.webp',
  },
  {
    title: 'SEO',
    description:
      'We help your website rank higher on Google through technical audits, keyword research, on-page optimization, and link building to improve visibility and bring in more organic traffic.',
    features: ['Keyword Research', 'Technical SEO', 'Link Building'],
    thumbnail: '/Content Images/Seo Thumbnail.webp',
  },
  {
    title: 'Website Development',
    description:
      'We design fast, responsive websites with clean UI/UX and conversion-focused funnels that load quickly and turn visitors into leads.',
    features: ['Responsive Design', 'Fast Performance', 'Lead Conversion'],
    thumbnail: '/Content Images/web development Thumbnail.webp',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-transparent">
      <Container>
        <div className="text-center mb-16">
          <Badge ariaLabel="section label" className="mb-4">What We Do</Badge>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black mt-6 mb-4 leading-tight">
            Our Services
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg sm:text-xl">
            Focused digital marketing services to help your brand grow online, get more leads, improve ROI, and support long-term growth.
          </p>
          <div className="mx-auto mt-6 h-px w-24 bg-linear-to-r from-transparent via-accent-to/70 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group flex flex-col bg-white rounded-4xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/8 cursor-default ring-1 ring-black/5"
            >
              {/* Thumbnail */}
              <div className="relative w-full h-56 sm:h-64 overflow-hidden rounded-4xl">
                <img
                  src={service.thumbnail}
                  alt={service.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 px-6 pb-7 pt-5">
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3">
                  {service.title}
                </h3>

                <p className="text-gray-700 text-sm leading-6 mb-6 flex-1">
                  {service.description}
                </p>

                <ul className="flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="inline-flex items-center rounded-full border border-accent-from/10 bg-accent-from/5 px-4 py-2 text-xs sm:text-sm font-semibold text-accent-from transition-colors duration-300"
                    >
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center sm:justify-end gap-4 w-full">
          <Button href="/services" variant="outline" size="lg" className="w-full sm:w-auto">
            View All Services →
          </Button>
          <Button href="/#contact" variant="primary" size="lg" className="w-full sm:w-auto">
            Get Started Today
          </Button>
        </div>
      </Container>
    </section>
  );
}