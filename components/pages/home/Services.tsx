import Image from 'next/image';
import Container from '@/components/global/Container';
import Button from '@/components/global/Button';
import { CheckIcon } from '@/components/global/icons';

const services = [
  {
    iconWrapClass: 'from-blue-500/25 to-cyan-400/25 group-hover:from-blue-500/40 group-hover:to-cyan-400/40',
    iconClass: 'text-cyan-300',
    checkClass: 'text-cyan-300',
    shadowColor: 'blue-500',
    headingColor: 'group-hover:text-cyan-500',
    icon: (
      <div className="grid grid-cols-2 gap-1.5 scale-110">
        <Image src="/logos/instagram 3d.png" alt="Instagram" width={20} height={20} className="w-5 h-5 object-contain drop-shadow-sm" />
        <Image src="/logos/facebook 3d.png" alt="Facebook" width={20} height={20} className="w-5 h-5 object-contain drop-shadow-sm" />
        <Image src="/logos/linkedin 3d.png" alt="LinkedIn" width={20} height={20} className="w-5 h-5 object-contain drop-shadow-sm col-span-2 mx-auto" />
      </div>
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
    shadowColor: 'pink-500',
    headingColor: 'group-hover:text-pink-500',
    icon: (
      <div className="relative w-11 h-11">
        <Image
          src="/logos/strategy%20planning.png"
          alt="Strategy planning"
          width={20}
          height={20}
          className="absolute top-0 left-0 w-5 h-5 object-contain drop-shadow-sm -rotate-12"
        />
        <Image
          src="/logos/marketing-strategy.png"
          alt="Marketing strategy"
          width={20}
          height={20}
          className="absolute top-1 right-0 w-5 h-5 object-contain drop-shadow-sm rotate-10"
        />
        <Image
          src="/logos/strategy-development.png"
          alt="Strategy development"
          width={24}
          height={24}
          className="absolute bottom-0 left-2 w-6 h-6 object-contain drop-shadow-sm"
        />
      </div>
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
    shadowColor: 'orange-500',
    headingColor: 'group-hover:text-orange-500',
    icon: (
      <div className="relative w-11 h-11">
        <Image
          src="/logos/google%203d.png"
          alt="Google"
          width={20}
          height={20}
          className="absolute top-0 left-0 w-5 h-5 object-contain drop-shadow-sm -rotate-12"
        />
        <Image
          src="/logos/meta%203d.png"
          alt="Meta"
          width={20}
          height={20}
          className="absolute top-1 right-0 w-5 h-5 object-contain drop-shadow-sm rotate-10"
        />
        <Image
          src="/logos/L-Dollar%20Coin%203d.svg"
          alt="Dollar"
          width={24}
          height={24}
          className="absolute bottom-0 left-2 w-6 h-6 object-contain drop-shadow-sm"
        />
      </div>
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
    shadowColor: 'emerald-500',
    headingColor: 'group-hover:text-emerald-500',
    icon: (
      <div className="relative w-12 h-12">
        <Image
          src="/logos/seo%203d.svg"
          alt="SEO"
          width={24}
          height={24}
          className="absolute top-0 left-0 w-6 h-6 object-contain drop-shadow-sm -rotate-12"
        />
        <Image
          src="/logos/L-Chart%203d.svg"
          alt="Chart"
          width={24}
          height={24}
          className="absolute top-1 right-0 w-6 h-6 object-contain drop-shadow-sm rotate-10"
        />
        <Image
          src="/logos/L-Code%203d.svg"
          alt="Code"
          width={28}
          height={28}
          className="absolute bottom-0 left-2.5 w-7 h-7 object-contain drop-shadow-sm"
        />
      </div>
    ),
    title: 'SEO',
    description:
      'Rank higher on Google with our proven SEO strategies — technical audits, keyword research, on-page optimization, and link building.',
    features: ['Keyword Research', 'Technical SEO', 'Link Building'],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-32 bg-transparent">
      <Container>
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-transparent border border-accent-from/20 text-accent-to text-xs font-semibold uppercase tracking-widest">
              What We Do
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black mt-6 mb-6 leading-tight">
            Our Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg sm:text-xl">
            A comprehensive suite of digital marketing services designed to grow your business online and deliver measurable results.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => {
            const shadowMap: { [key: string]: string } = {
              'blue-500': 'hover:shadow-blue-500/20',
              'pink-500': 'hover:shadow-pink-500/20',
              'orange-500': 'hover:shadow-orange-500/20',
              'emerald-500': 'hover:shadow-emerald-500/20',
            };
            return (
            <div
              key={service.title}
              className={`group relative h-full p-8 rounded-3xl bg-linear-to-br from-gray-50 to-white border border-gray-200 hover:border-accent-from/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${shadowMap[service.shadowColor]} cursor-default overflow-hidden`}
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
                <h3 className={`text-xl font-bold text-black mb-4 ${service.headingColor} transition-colors duration-300`}>
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckIcon className={`w-5 h-5 ${service.checkClass} shrink-0 mt-0.5`} />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            );
          })}
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
