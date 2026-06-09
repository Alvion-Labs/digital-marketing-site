import Image from 'next/image';

import Container from '@/components/global/Container';

export default function SeoPreviewGuide() {
  return (
    <>
      <div className="border-t border-gray-200" />

      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl space-y-14">
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">What is a Meta Title?</h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              A meta title (also known as a title tag) is the clickable headline that appears in Google Search results, browser tabs, social shares, and bookmarks. It helps users and search engines understand the topic of your page and is one of the most important <a href="/blog/what-is-on-page-seo-understanding-the-basics-of-website-optimization" className="text-blue-600 no-underline font-bold">on-page SEO</a> elements.
            </p>
            <p className="mt-3 text-base text-gray-600 leading-relaxed">
              For <a href="/blog/seo-complete-beginner-to-advanced-guide-for-2026#what-is-seo" className="text-blue-600 no-underline font-bold">SEO</a>, <a href="/blog/what-is-ai-seo-complete-beginner-guide#what-is-ai-seo" className="text-blue-600 no-underline font-bold">AI SEO</a>, and <a href="/blog/what-is-digital-marketing-complete-beginner-guide#what-is-digital-marketing" className="text-blue-600 no-underline font-bold">digital marketing</a>, the meta title plays a crucial role in improving visibility, increasing click-through rates (CTR), and helping search engines determine the relevance of your content.
            </p>

            <div className="mt-6 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
              <Image
                src="/Pages/Tools/Meta Preview/Title Previw wiht description blurred in S-eangine sites list.webp"
                alt="Google search results showing how meta titles appear in the listing"
                width={1200}
                height={400}
                className="w-full h-auto"
              />
            </div>

            <div className="mt-8 grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">Why It Matters for SEO</h3>
                <ol className="mt-4 space-y-[14px]">
                  {[
                    ['Higher Click-Through Rate (CTR)', 'A compelling title encourages users to click your result instead of competing pages.'],
                    ['Better Search Rankings', 'Title tags help Google understand your content and improve keyword relevance.'],
                    ['AI Search Visibility', 'AI-powered search engines and answer engines use page titles to understand and reference content.'],
                    ['Stronger Brand Recognition', 'Consistently including your brand name builds trust and recognition across search results.'],
                    ['Improved User Experience', "Clear titles help users quickly identify the information they're looking for."],
                  ].map(([title, desc], i) => (
                    <li key={i} className="flex items-start gap-3.5">
                      <span className="min-w-[28px] h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                      <div className="pt-px">
                        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
                        <p className="mt-1 text-sm text-gray-600">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">Best Practices</h3>
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-3">
                    <Image src="/icons/Green check Icon.webp" alt="" width={20} height={20} className="w-5 h-5 shrink-0 mt-0.5" />
                    Include your primary keyword near the beginning of the title.
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/Green check Icon.webp" alt="" width={20} height={20} className="w-5 h-5 shrink-0 mt-0.5" />
                    Keep the length around 50-63 characters to reduce truncation in search results.
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/Green check Icon.webp" alt="" width={20} height={20} className="w-5 h-5 shrink-0 mt-0.5" />
                    Write a unique title for every page.
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/Green check Icon.webp" alt="" width={20} height={20} className="w-5 h-5 shrink-0 mt-0.5" />
                    Add your brand name at the end (e.g., <a href="https://www.alviondigital.in" className="text-blue-600 no-underline font-bold">alvion digital</a>).
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/Green check Icon.webp" alt="" width={20} height={20} className="w-5 h-5 shrink-0 mt-0.5" />
                    Make the title descriptive, relevant, and user-focused.
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/Cross Icon with read Bg.webp" alt="" width={20} height={20} className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-gray-500">Avoid keyword stuffing, misleading phrases, or clickbait.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">What is a Meta Description?</h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              A meta description is the short summary snippet that appears under the title in Google&rsquo;s search results. While it&rsquo;s not a direct ranking factor, it heavily influences whether someone clicks your result, making it one of the most impactful pieces of real estate on the web.
            </p>

            <div className="mt-6 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
              <Image
                src="/Pages/Tools/Meta Preview/Description preview Titel Blurred S-engingle list.webp"
                alt="Google search results showing how meta descriptions appear in the listing"
                width={1200}
                height={400}
                className="w-full h-auto"
              />
            </div>

            <div className="mt-8 grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">Why It Matters for SEO</h3>
                <ol className="mt-4 space-y-[14px]">
                  {[
                    ['CTR Booster', 'A clear, benefit-driven description can increase clicks by 5-10%.'],
                    ['Reduces Bounce Rate', 'Accurate descriptions bring the right visitors.'],
                    ['Featured Snippets', 'Google may pull your description into answer boxes.'],
                    ['Social Preview', 'Often used when your page is shared on social platforms.'],
                  ].map(([title, desc], i) => (
                    <li key={i} className="flex items-start gap-3.5">
                      <span className="min-w-[28px] h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                      <div className="pt-px">
                        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
                        <p className="mt-1 text-sm text-gray-600">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">Best Practices</h3>
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-3">
                    <Image src="/icons/Green check Icon.webp" alt="" width={20} height={20} className="w-5 h-5 shrink-0 mt-0.5" />
                    Aim for 120-140 characters; longer descriptions are more likely to be cut off.
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/Green check Icon.webp" alt="" width={20} height={20} className="w-5 h-5 shrink-0 mt-0.5" />
                    Include the target keyword naturally so matching terms are easier to scan.
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/Green check Icon.webp" alt="" width={20} height={20} className="w-5 h-5 shrink-0 mt-0.5" />
                    Lead with value: what will the reader learn, buy, or discover?
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/Green check Icon.webp" alt="" width={20} height={20} className="w-5 h-5 shrink-0 mt-0.5" />
                    Write a unique description per page; avoid auto-generated text.
                  </li>
                  <li className="flex items-start gap-3">
                    <Image src="/icons/Green check Icon.webp" alt="" width={20} height={20} className="w-5 h-5 shrink-0 mt-0.5" />
                    Add a subtle call-to-action (&ldquo;Learn more,&rdquo; &ldquo;Get started,&rdquo; etc.).
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Live SERP Test</h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              For our first test, we checked the preview tool against a live Google result using the same title and meta description. The screenshots below show the tool preview beside the matching SERP listing, so you can trust the preview as a practical review point before publishing.
            </p>
            <div className="mt-6 grid items-start gap-8 rounded-xl border border-gray-200 p-4 sm:grid-cols-2 sm:p-5 lg:p-6">
              <div className="min-w-0">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-950">Tool Preview</h3>
                <div className="mt-3 flex min-h-[220px] items-start justify-center sm:min-h-[260px] lg:min-h-[300px]">
                  <Image
                    src="/Pages/Tools/Meta Preview/Example One Preview.webp"
                    alt="SEO preview tool screenshot using the same title and description as the live SERP listing"
                    width={2389}
                    height={994}
                    className="max-h-[260px] w-full rounded-lg object-contain lg:max-h-[300px]"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-950">Live SERP</h3>
                <div className="mt-3 flex min-h-[220px] items-start justify-center sm:min-h-[260px] lg:min-h-[300px]">
                  <Image
                    src="/Pages/Tools/Meta Preview/Example One SERP list Preview.webp"
                    alt="Live Google SERP listing screenshot using the same title and description as the preview tool"
                    width={1312}
                    height={308}
                    className="max-h-[260px] w-full rounded-lg object-contain lg:max-h-[300px]"
                  />
                </div>
              </div>
            </div>
          </section>

        </div>
      </Container>
    </>
  );
}
