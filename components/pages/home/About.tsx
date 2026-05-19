import Container from '@/components/global/Container';
import Button from '@/components/global/Button';
import Link from 'next/link';

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-24 bg-transparent">
      <Container>
        <header className="text-center mb-16">
          <h2 id="about-heading" className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black mb-4 leading-tight">
            who we are
          </h2>
          <div className="mx-auto mt-6 h-px w-24 bg-linear-to-r from-transparent via-accent-to/70 to-transparent" />
        </header>

        <article className="max-w-4xl mx-auto">
          <div className="space-y-6 text-gray-700 text-base sm:text-lg leading-8">
            <p>
              We are a digital marketing agency helping businesses grow online through simple,
              effective, and result-driven strategies.
            </p>

            <p>
              Our focus is to improve your brand visibility, attract the right audience, and convert
              traffic into real customers. From SEO services and social media marketing to paid ads
              and web development, we create solutions that drive measurable business growth.
            </p>

            <p>
              We believe in clarity, creativity, and performance. Every strategy we build is designed
              to deliver real results, more visibility, better engagement, and higher conversions.
            </p>

            <p>
              Whether you’re a startup or an established business, we work as your growth partner to
              build a strong and successful digital presence.
            </p>

            <p>
              Explore our{' '}
              <Link href="/services" className="text-accent-from hover:text-accent-to underline underline-offset-4">
                digital marketing services
              </Link>{' '}
              and latest{' '}
              <Link href="/blog" className="text-accent-from hover:text-accent-to underline underline-offset-4">
                SEO and marketing insights
              </Link>
              .
            </p>
          </div>

          <div className="mt-10 text-center">
            <Button href="/#contact" variant="primary" className="px-8 py-4 text-base">
              Let&apos;s Grow Your Brand
            </Button>
          </div>
        </article>
      </Container>
    </section>
  );
}
