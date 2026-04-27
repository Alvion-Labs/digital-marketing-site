import Container from '@/components/global/Container';
import Button from '@/components/global/Button';
import { MagnifyingGlassIcon, MegaphoneIcon, PencilSquareIcon, ShareNodesIcon, CheckIcon } from '@/components/global/icons';

const services = [
  {
    iconWrapClass: 'from-blue-500/25 to-cyan-400/25 group-hover:from-blue-500/40 group-hover:to-cyan-400/40',
    iconClass: 'text-cyan-300',
    checkClass: 'text-cyan-300',
    icon: (
      <ShareNodesIcon className="w-10 h-10" />
    ),
    title: 'Social Media Management',
    description:
      'We manage your social profiles end-to-end — from content creation and scheduling to community engagement and analytics reporting.',
    features: ['Content Planning', 'Community Management', 'Analytics'],
  },
  {
    iconWrapClass: 'from-fuchsia-500/25 to-pink-400/25 group-hover:from-fuchsia-500/40 group-hover:to-pink-400/40',
    iconClass: 'text-pink-300',
    checkClass: 'text-pink-300',
    icon: (
      <PencilSquareIcon className="w-10 h-10" />
    ),
    title: 'Content Strategy',
    description:
      'From brand storytelling to viral campaigns, our content strategists plan, produce, and distribute content that connects and converts.',
    features: ['Brand Storytelling', 'Campaign Creation', 'Distribution'],
  },
  {
    iconWrapClass: 'from-amber-500/25 to-orange-400/25 group-hover:from-amber-500/40 group-hover:to-orange-400/40',
    iconClass: 'text-orange-300',
    checkClass: 'text-orange-300',
    icon: (
      <MegaphoneIcon className="w-10 h-10" />
    ),
    title: 'Google & Meta Ads',
    description:
      'Maximize your ad spend with data-driven Google Ads and Meta campaigns crafted to generate leads, sales, and brand awareness.',
    features: ['Campaign Setup', 'Optimization', 'ROI Tracking'],
  },
  {
    iconWrapClass: 'from-emerald-500/25 to-lime-400/25 group-hover:from-emerald-500/40 group-hover:to-lime-400/40',
    iconClass: 'text-lime-300',
    checkClass: 'text-lime-300',
    icon: (
      <MagnifyingGlassIcon className="w-10 h-10" />
    ),
    title: 'SEO',
    description:
      'Rank higher on Google with our proven SEO strategies — technical audits, keyword research, on-page optimization, and link building.',
    features: ['Keyword Research', 'Technical SEO', 'Link Building'],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-32 bg-linear-to-b from-[#061c2e] to-[#0a2540]">
      <Container>
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-accent-from/10 border border-accent-from/30 text-accent-to text-xs font-semibold uppercase tracking-widest">
              What We Do
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mt-6 mb-6 leading-tight">
            Our Services
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg sm:text-xl">
            A comprehensive suite of digital marketing services designed to grow your business online and deliver measurable results.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative h-full p-8 rounded-3xl bg-linear-to-br from-[#0d2d47]/60 to-[#061c2e]/40 border border-white/5 hover:border-accent-from/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 cursor-default overflow-hidden"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-accent-from/10 to-accent-to/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Decorative glow */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent-from/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                {/* Icon Container */}
                <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${service.iconWrapClass} flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-accent-from/5`}>
                  <div className={service.iconClass}>{service.icon}</div>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-accent-to transition-colors duration-300">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckIcon className={`w-5 h-5 ${service.checkClass} shrink-0 mt-0.5`} />
                      <span className="text-slate-400 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-end">
          <Button href="/#contact" variant="primary" className="px-10 py-4 text-lg">
            Get Started Today
          </Button>
        </div>
      </Container>
    </section>
  );
}
