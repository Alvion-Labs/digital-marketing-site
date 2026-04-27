import Link from 'next/link';
import Container from '@/components/global/Container';
import { formatBlogDate, type BlogPost as BlogPostType } from '@/lib/blog';

interface BlogPostProps {
  post: BlogPostType;
}

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <>
      <section className="relative overflow-hidden bg-primary py-24 md:py-28">
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-accent-from/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent-to/20 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-4xl">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-accent-to font-semibold mb-6 hover:text-white transition-colors">
              <span aria-hidden>←</span>
              Back to blog
            </Link>

            <span className="inline-flex items-center rounded-full border border-accent-from/40 bg-accent-from/10 px-4 py-2 text-sm font-semibold text-accent-to">
              {post.category}
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg text-slate-300 leading-relaxed">{post.summary}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
              <span>{post.author}</span>
              <span>{formatBlogDate(post.publishedAt)}</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#061c2e] py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
            <article className="rounded-3xl border border-white/5 bg-[#0d2d47] p-8 md:p-10">
              <div
                className="h-56 w-full rounded-2xl mb-10"
                style={{ background: `linear-gradient(135deg, ${post.accentFrom}, ${post.accentTo})` }}
              />

              <div className="space-y-10">
                {post.sections.map((section) => (
                  <section key={section.heading}>
                    <h2 className="text-2xl font-bold text-white mb-4">{section.heading}</h2>
                    <div className="space-y-4 text-slate-300 leading-relaxed">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    {section.bullets && (
                      <ul className="mt-5 space-y-3">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3 text-slate-300">
                            <span className="mt-2 h-2 w-2 rounded-full bg-accent-to shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>
            </article>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/5 bg-[#0d2d47] p-6">
                <h3 className="text-lg font-bold text-white mb-4">Key takeaways</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  {post.takeaways.map((takeaway) => (
                    <li key={takeaway} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-accent-from shrink-0" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-white/5 bg-[#0d2d47] p-6">
                <h3 className="text-lg font-bold text-white mb-3">Want help with your content?</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">
                  We can turn this strategy into a full content plan, blog system, and promotion workflow.
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center rounded-lg bg-linear-to-r from-accent-from to-accent-to px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:opacity-90 transition-opacity"
                >
                  Talk to our team
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}