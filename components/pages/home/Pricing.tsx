import Container from '@/components/global/Container';
import Button from '@/components/global/Button';
import { CheckIcon } from '@/components/global/icons';

const plans = [
  {
    name: 'Starter',
    price: '₹9,999',
    period: '/month',
    description: 'Perfect for local businesses building a consistent presence',
    features: [
      '8 social media posts (graphics + captions)',
      'Basic content calendar',
      'Monthly performance report',
      '1 platform (Instagram or Facebook)',
    ],
    featured: false,
  },
  {
    name: 'Growth',
    price: '₹24,999',
    period: '/month',
    description: 'For businesses ready to generate leads and scale visibility',
    features: [
      '16 social media posts',
      'Ad campaign setup & management (budget excluded)',
      'Bi-weekly strategy calls',
      '2 platforms (Instagram + Facebook)',
      'Basic lead generation support',
      'Priority support',
    ],
    featured: true,
  },
  {
    name: 'Scale',
    price: '₹49,999',
    period: '/month',
    description: 'For brands aiming for consistent growth and conversions',
    features: [
      '30 social media posts',
      'Advanced ads + retargeting',
      'SEO optimization (basic website)',
      'Weekly growth review call',
      'Multi-platform management',
      'Performance-focused strategy',
    ],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-transparent">
      <Container>
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-accent-from/10 border border-accent-from/30 text-accent-to text-xs font-semibold uppercase tracking-widest">
              Pricing
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mt-3 mb-5">
            Simple Plans For Every Stage
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Transparent monthly pricing with no hidden fees. Pick a plan and let&apos;s start growing your brand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-7 border transition-all duration-300 ${
                plan.featured
                  ? 'bg-linear-to-b from-blue-50 to-white border-accent-from/30 shadow-xl shadow-blue-500/10 md:-translate-y-2'
                  : 'bg-white border-gray-200 hover:border-accent-from/40'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-linear-to-r from-accent-from to-accent-to text-white">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-bold text-black mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-black">{plan.price}</span>
                <span className="text-gray-600 text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckIcon className="w-5 h-5 text-accent-to shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <Button href="/#contact" variant="primary" className="px-8 py-3">
            Get Started
          </Button>
        </div>
      </Container>
    </section>
  );
}
