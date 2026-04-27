import Container from '@/components/global/Container';
import Button from '@/components/global/Button';
import { CheckIcon } from '@/components/global/icons';

const plans = [
  {
    name: 'Starter',
    price: '$299',
    period: '/month',
    description: 'Perfect for small businesses building a consistent social presence.',
    features: [
      '8 social posts per month',
      'Basic content calendar',
      'Monthly performance report',
      '1 social media platform',
    ],
    featured: false,
  },
  {
    name: 'Growth',
    price: '$699',
    period: '/month',
    description: 'Best for brands ready to scale reach, leads, and engagement.',
    features: [
      '16 social posts per month',
      'Ad campaign management',
      'Bi-weekly strategy calls',
      '2 social media platforms',
      'Priority support',
    ],
    featured: true,
  },
  {
    name: 'Scale',
    price: '$1,299',
    period: '/month',
    description: 'For ambitious businesses that need full-funnel digital growth.',
    features: [
      '30 social posts per month',
      'Advanced ads + retargeting',
      'SEO optimization package',
      'Weekly growth review call',
      'Multi-platform management',
    ],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-[#041728]">
      <Container>
        <div className="text-center mb-16">
          <span className="text-accent-to text-sm font-semibold uppercase tracking-widest">Pricing</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-3 mb-5">
            Simple Plans For Every Stage
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Transparent monthly pricing with no hidden fees. Pick a plan and let&apos;s start growing your brand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-7 border transition-all duration-300 ${
                plan.featured
                  ? 'bg-[#0d2d47] border-accent-from/50 shadow-xl shadow-blue-500/20 md:-translate-y-2'
                  : 'bg-[#0d2d47] border-white/10 hover:border-accent-from/40'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-linear-to-r from-accent-from to-accent-to text-white">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-slate-400 text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
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
