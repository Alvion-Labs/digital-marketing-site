import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/global/Container';
import { formatBlogDate, type BlogPost as BlogPostType } from '@/lib/blog';
import { XTwitterIcon, LinkedInIcon, FacebookIcon } from '@/components/global/icons';

interface BlogPostProps {
  post: BlogPostType;
}

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <>
      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <div
          className="h-full bg-linear-to-r from-accent-from to-accent-to transition-all duration-150"
          style={{
            width: '0%',
            transformOrigin: 'left',
          }}
          id="reading-progress"
        />
      </div>

      <section className="relative overflow-hidden bg-linear-to-b from-gray-50 to-white py-20 md:py-24">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-from/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-to/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-30 pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-4xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-gray-600 font-medium mb-6 hover:text-accent-to transition-all hover:-translate-x-1 duration-300"
            >
              <span aria-hidden className="text-lg">←</span>
              Back to all articles
            </Link>

            <div className="flex flex-wrap gap-3 mb-8">
              <span className="inline-flex items-center rounded-full border border-accent-from/30 bg-linear-to-r from-accent-from/10 to-accent-to/10 px-5 py-2 text-sm font-semibold text-accent-to shadow-sm">
                {post.category}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight bg-linear-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
              {post.title}
            </h1>

            <p className="mt-6 max-w-3xl text-xl md:text-2xl text-gray-600 leading-relaxed font-medium">
              {post.summary}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white p-1.5 border border-gray-200 shadow-sm">
                  <Image
                    src="/AlvionLogo.png"
                    alt="Alvion Digital Marketing"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-medium text-gray-700">{post.author}</span>
              </div>
              <div className="h-4 w-px bg-gray-300 hidden sm:block" />
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatBlogDate(post.publishedAt)}
              </span>
              <div className="h-4 w-px bg-gray-300 hidden sm:block" />
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readTime} read
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-linear-to-b from-white to-gray-50 py-16 md:py-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Featured Hero Banner */}
            {post.thumbnail ? (
              <div className="h-52 md:h-72 w-full rounded-2xl mb-16 relative overflow-hidden shadow-xl">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
              </div>
            ) : (
              <div
                className="h-52 md:h-64 w-full rounded-2xl mb-16 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${post.accentFrom}, ${post.accentTo})` }}
              >
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
              </div>
            )}

            {/* Main Article Content - Clean Minimal Design */}
            <article className="space-y-16">
              {post.sections.map((section) => (
                <section
                  key={section.heading}
                  id={section.heading.toLowerCase().replace(/\s+/g, '-')}
                  className="scroll-mt-28"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                    {section.heading}
                  </h2>
                  <div className="h-0.5 w-16 bg-linear-to-r from-accent-from to-accent-to rounded-full mb-8" />

                  <div className="space-y-6 text-gray-700 leading-[1.85] text-lg">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  {section.bullets && (
                    <ul className="mt-8 space-y-4 ml-4">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-4 text-gray-700 items-start text-lg">
                          <div className="mt-2.5 h-2 w-2 rounded-full bg-accent-to shrink-0" />
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </article>

            {/* Clean Footer CTA */}
            <div className="mt-20 pt-12 border-t border-gray-200">
              <div className="rounded-2xl bg-linear-to-br from-accent-from/5 to-accent-to/5 p-8 md:p-10 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Need help implementing this?</h3>
                <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                  Our team can help you build this strategy into actionable results for your business.
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-accent-from to-accent-to px-8 py-3.5 font-semibold text-white shadow-lg shadow-accent-from/20 hover:shadow-xl hover:shadow-accent-from/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Get in touch with our team
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
