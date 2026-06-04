import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/global/Container';
import { formatBlogDate, type BlogPost as BlogPostType } from '@/lib/blog';
import Badge from '@/components/global/Badge';
import { XTwitterIcon, LinkedInIcon, FacebookIcon } from '@/components/global/icons';
import RelatedPosts from '@/components/pages/blog/RelatedPosts';
import TOC from '@/components/pages/blog/TOC';
import { sanitizeBlogHtml } from '@/lib/html';
import { dedupeFaqEntries } from '@/lib/blog';
import BlogTldrThumbnail from '@/components/pages/blog/BlogTldrThumbnail';
import BlogRatingComponent from '@/components/pages/blog/BlogRatingComponent';
import Button from '@/components/global/Button';

interface BlogPostProps {
  post: BlogPostType;
}

export default function BlogPost({ post }: BlogPostProps) {
  // Use contentHTML directly (contentBlocks support removed)
  const contentHTML = post.contentHTML || '';
  const safeContentHTML = contentHTML ? sanitizeBlogHtml(contentHTML) : '';

  // Resolve anchors for dynamic sections (conclusion, faqs) using the post's
  // `tableOfContents` if available so TOC links work when those items are added
  const tableOfContents = (post as any)?.tableOfContents || [];
  const findAnchorFor = (candidates: string[], fallback: string) => {
    for (const item of tableOfContents) {
      if (!item || !item.title) continue;
      const t = String(item.title).toLowerCase();
      for (const c of candidates) {
        if (t.includes(String(c).toLowerCase())) return item.anchor;
      }
    }
    return fallback;
  };
  const conclusionAnchor = findAnchorFor(['conclusion', 'concluding'], 'conclusion');
  const faqsAnchor = findAnchorFor(['faq', 'faqs', 'frequently', 'questions'], 'faqs');
  const faqs = Array.isArray((post as any).faqs) ? dedupeFaqEntries((post as any).faqs) : [];
  const rawBlogId = (post as any)?._id;
  const blogIdForFeedback = typeof rawBlogId === 'string' ? rawBlogId : rawBlogId?.toString?.() || post.slug;

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

      <section className="relative overflow-hidden border-b border-gray-200 bg-linear-to-b from-gray-50 to-white py-12 md:py-16">
        {/* Removed decorative color bubbles to simplify hero */}

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
              <Badge ariaLabel="post category">{post.category}</Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight bg-linear-to-r from-accent-from to-accent-to bg-clip-text text-transparent mb-6">
              {post.title}
            </h1>

            <p className="mt-6 max-w-3xl text-base md:text-lg text-gray-600 leading-relaxed">
              {post.excerpt || post.summary}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white p-1.5 border border-gray-200 shadow-sm">
                  <Image
                    src="/Alvion%20Logo%20landsacpe.webp"
                    alt="Alvion Digital Marketing"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                    style={{ width: 'auto' }}
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
              {(post as any).updatedAt && formatBlogDate((post as any).updatedAt) !== formatBlogDate(post.publishedAt) && (
                <>
                  <div className="h-4 w-px bg-gray-300 hidden sm:block" />
                  <span className="flex items-center gap-2 text-amber-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Updated {formatBlogDate((post as any).updatedAt)}
                  </span>
                </>
              )}
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

      <section className="bg-linear-to-b from-white to-gray-50 py-12 md:py-16">
        {/* Mobile TOC - Sticky */}
        <div className="md:hidden sticky top-16 z-30 bg-linear-to-b from-white via-white to-white/95">
          <div className="px-4 sm:px-6 lg:px-8">
            <TOC items={(post as any)?.tableOfContents || []} />
          </div>
        </div>

        <Container>
          <div className="max-w-7xl mx-auto">
            {((post as any)?.tldr) && (
              <div className="mb-10 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-5 md:px-6 md:py-6 shadow-sm">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700">TL;DR</span>
                    <h3 className="text-sm font-semibold text-gray-700">Quick summary</h3>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    {(post as any)?.thumbnail ? (
                      <BlogTldrThumbnail
                        src={(post as any).thumbnail}
                        alt={(post as any).title || 'thumbnail'}
                        className="shrink-0 h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28"
                      />
                    ) : null}

                    <p className="text-sm leading-relaxed text-gray-900 md:text-base">{(post as any)?.tldr}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Sidebar - TOC - 1 column (hidden on mobile) - moved left */}
              <div className="hidden md:block md:col-span-1">
                <TOC items={(post as any)?.tableOfContents || []} />
              </div>

              {/* Main Content - 3 columns */}
              <div className="md:col-span-3">
                {/* Removed decorative banner to avoid occluding content */}

                {/* Main Article Content - Clean Minimal Design */}
                <article className="space-y-12">
                  {safeContentHTML ? (
                    <div 
                      className="blog-content max-w-none"
                      dangerouslySetInnerHTML={{ __html: safeContentHTML }}
                    />
                  ) : post.sections && post.sections.length > 0 ? (
                    post.sections.map((section) => (
                      <section
                        key={section.heading}
                        id={section.heading?.toLowerCase().replace(/\s+/g, '-') || 'section'}
                        className="scroll-mt-28"
                      >
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                          {section.heading}
                        </h2>
                        <div className="h-0.5 w-16 bg-linear-to-r from-accent-from to-accent-to rounded-full mb-8" />

                        <div className="space-y-6 text-gray-700 leading-[1.85] text-lg">
                          {section.paragraphs?.map((paragraph) => (
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
                    ))
                  ) : null}
                </article>
                {/* Conclusion (rendered after article) */}
                {(post as any).conclusion && (
                  <div id={conclusionAnchor} className="mt-8 scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">Conclusion</h2>
                    <div className="blog-content max-w-none">
                      <p className="text-gray-700 leading-relaxed text-base">{(post as any).conclusion}</p>
                    </div>
                  </div>
                )}

                {/* FAQs (rendered after conclusion) */}
                {faqs.length > 0 && (
                  <div id={faqsAnchor} className="mt-8 scroll-mt-28">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      <ol className="space-y-4">
                        {faqs.map((f: any, i: number) => (
                          <li key={i} className="pl-0">
                            <div className="flex items-start gap-4">
                              <div className="shrink-0">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-900 font-semibold">{i + 1}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 mb-1">{f.question ? sanitizeBlogHtml(f.question) : `Question ${i+1}`}</p>
                                <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(f.answer || '') }} />
                              </div>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}

                {/* Blog rating and suggestion (moved below FAQs) */}
                <div className="mt-8">
                  <BlogRatingComponent blogId={blogIdForFeedback} />
                </div>

                {/* Clean Footer CTA */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="rounded-2xl bg-linear-to-br from-accent-from/5 to-accent-to/5 p-8 md:p-10 text-center">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Need help implementing this?</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-4">
                      Our team can help you build this strategy into actionable results for your business.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button href="/#contact" variant="primary" size="lg" className="w-full sm:w-auto">
                          Get in touch with our team
                        </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* (TOC moved to the left column above) */}
            </div>
            {/* Related posts */}
            <RelatedPosts category={post.category} currentSlug={post.slug} />
          </div>
        </Container>
      </section>
    </>
  );
}
