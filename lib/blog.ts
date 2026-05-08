export interface BlogSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  author: string;
  accentFrom: string;
  accentTo: string;
  summary: string;
  sections: BlogSection[];
  takeaways: string[];
  thumbnail?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-build-a-content-calendar',
    title: 'How to Build a Content Calendar That Keeps Your Brand Consistent',
    excerpt:
      'A practical framework for planning content that balances campaigns, evergreen posts, and the day-to-day social rhythm your audience expects.',
    category: 'Content Strategy',
    publishedAt: '2026-04-08',
    readTime: '6 min read',
    author: 'Alvion Digital Team',
    accentFrom: '#1a1054',
    accentTo: '#255ff1',
    thumbnail: '/Content Images/content Calender.png',
    summary:
      'A strong content calendar keeps your messaging clear, reduces last-minute publishing, and helps every post support a measurable marketing goal.',
    sections: [
      {
        heading: 'Start with content pillars',
        paragraphs: [
          'Before you schedule a single post, define three to five pillars that reflect the topics your audience actually wants. For most brands, that means a mix of education, proof, product, and personality.',
          'These pillars give your content a structure. Instead of guessing what to post next, your team can move through a repeatable system that keeps the feed balanced and on-brand.',
        ],
        bullets: ['Education posts that teach', 'Proof posts that build trust', 'Product or service posts that convert'],
      },
      {
        heading: 'Map campaigns to the calendar',
        paragraphs: [
          'Once your pillars are in place, layer campaigns on top of them. Launches, seasonal moments, offers, and brand stories should all have a place in the calendar so they do not collide with each other.',
          'This approach makes planning easier for your design, copy, and media teams because everyone can see what needs to be created and when it needs to go live.',
        ],
      },
      {
        heading: 'Review performance every week',
        paragraphs: [
          'A content calendar should not be static. Review reach, saves, clicks, and comments each week, then adjust the next cycle based on what your audience responds to.',
          'The best calendars evolve over time. They keep the content engine moving while making space for new ideas and better-performing formats.',
        ],
      },
    ],
    takeaways: [
      'Use content pillars to remove guesswork.',
      'Connect campaigns to weekly publishing goals.',
      'Audit performance so the calendar improves over time.',
    ],
  },
  {
    slug: 'why-meta-ads-work-better-with-seo',
    title: 'Why Meta Ads Work Better When SEO Is Part of the Plan',
    excerpt:
      'Paid social performs best when it is supported by strong organic visibility, clear landing pages, and search-intent aligned messaging.',
    category: 'Paid Media',
    publishedAt: '2026-03-25',
    readTime: '5 min read',
    author: 'Alvion Digital Team',
    accentFrom: '#0EA5E9',
    accentTo: '#22C55E',
    thumbnail: '/Content Images/SEO-Optimization-For-Website.webp',
    summary:
      'Meta Ads are powerful for reach and demand generation, but they become much more efficient when SEO sharpens your positioning and landing page relevance.',
    sections: [
      {
        heading: 'SEO improves message clarity',
        paragraphs: [
          'Keyword research reveals the phrases people use when they are close to buying. That insight helps you write ads and landing pages that match real intent instead of generic marketing language.',
          'When ad copy, page copy, and organic content all point to the same value proposition, people understand your offer faster and convert with less friction.',
        ],
      },
      {
        heading: 'Landing pages need search depth',
        paragraphs: [
          'A landing page that only repeats the ad headline usually underperforms. Strong SEO-informed pages answer objections, explain benefits, and give search engines enough context to understand the page.',
          'That extra depth helps both your paid traffic and your organic traffic because the same page can serve as a conversion asset and a discoverable resource.',
        ],
        bullets: ['Use the same terminology across ad and page copy', 'Answer common objections above the fold', 'Add supporting sections for trust and proof'],
      },
      {
        heading: 'Organic content warms the audience',
        paragraphs: [
          'SEO content does not only help rankings. Blog posts, guides, and resource pages can warm an audience before they ever see a retargeting ad, making paid campaigns more efficient.',
          'That is why the best-performing marketing systems combine discovery, education, and conversion into one connected path.',
        ],
      },
    ],
    takeaways: [
      'SEO clarifies the message behind the ad.',
      'Search-aligned landing pages improve conversion rate.',
      'Organic content lowers the cost of paid acquisition over time.',
    ],
  },
  {
    slug: 'instagram-reels-strategy-for-2026',
    title: 'Instagram Reels Strategy for 2026: What Brands Should Prioritize',
    excerpt:
      'Short-form video still drives reach, but the brands winning in 2026 are the ones combining clear hooks, consistent edits, and real audience value.',
    category: 'Social Media',
    publishedAt: '2026-03-12',
    readTime: '4 min read',
    author: 'Alvion Digital Team',
    accentFrom: '#8B5CF6',
    accentTo: '#EC4899',
    thumbnail: '/Content Images/instagram-.webp',
    summary:
      'Reels work when they feel fast, specific, and useful. The format rewards clarity, pacing, and repeatable creative systems more than one-off viral attempts.',
    sections: [
      {
        heading: 'Lead with the hook',
        paragraphs: [
          'The first second matters. Start with the outcome, problem, or surprise so viewers know why they should keep watching.',
          'A strong hook is not clickbait. It simply makes the value of the video obvious before attention drifts elsewhere.',
        ],
      },
      {
        heading: 'Keep the creative system simple',
        paragraphs: [
          'Brands often overcomplicate Reels with too many transitions or visual effects. Simplicity usually performs better because it keeps the message front and center.',
          'Use a repeatable edit style, a consistent caption structure, and a small set of formats you can produce every week.',
        ],
      },
      {
        heading: 'Build content that earns saves',
        paragraphs: [
          'If people save your Reel, it signals value. Educational clips, quick how-tos, and useful checklists are more likely to be saved and shared than generic promotional posts.',
          'That behavior gives the algorithm more confidence that your content matters, which helps extend reach over time.',
        ],
      },
    ],
    takeaways: [
      'Use a clear hook in the first second.',
      'Keep production patterns repeatable.',
      'Create content worth saving and sharing.',
    ],
  },
  {
    slug: 'local-seo-checklist-for-service-brands',
    title: 'Local SEO Checklist for Service Brands That Want More Leads',
    excerpt:
      'A focused checklist for service businesses that need stronger visibility in maps, local searches, and city-specific queries.',
    category: 'SEO',
    publishedAt: '2026-02-28',
    readTime: '7 min read',
    author: 'Alvion Digital Team',
    accentFrom: '#F59E0B',
    accentTo: '#EF4444',
    thumbnail: '/Content Images/SEO-Optimization-For-Website.webp',
    summary:
      'Local SEO is about consistency across your website, Google Business Profile, citations, and reviews so nearby customers can find and trust you quickly.',
    sections: [
      {
        heading: 'Optimize the service pages',
        paragraphs: [
          'Each core service should have its own page with a clear location focus, a strong headline, and proof that the business serves the area well.',
          'These pages should explain the offer, answer local questions, and make it easy for someone to contact you without searching for the next step.',
        ],
      },
      {
        heading: 'Keep your business information consistent',
        paragraphs: [
          'Your name, address, phone number, and service areas should match everywhere they appear. Small inconsistencies create friction for both search engines and customers.',
          'A clean profile across your website and listings helps build trust and reinforces local relevance.',
        ],
        bullets: ['Match NAP details across all platforms', 'Use local wording naturally in page copy', 'Collect and respond to reviews regularly'],
      },
      {
        heading: 'Track the calls and forms that matter',
        paragraphs: [
          'Traffic is useful, but leads are the goal. Measure calls, quote requests, and form submissions so you know which local pages actually produce revenue.',
          'That data tells you where to invest next and which city pages deserve more content support.',
        ],
      },
    ],
    takeaways: [
      'Build dedicated service pages with local intent.',
      'Keep profile data consistent across channels.',
      'Measure leads, not just traffic.',
    ],
  },
];

export function getAllBlogPosts() {
  return [...blogPosts].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export function getFeaturedBlogPosts(limit = 3) {
  return getAllBlogPosts().slice(0, limit);
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}