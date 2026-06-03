import { BlogPost, BlogFaqItem, dedupeFaqEntries } from '@/lib/blog';
import { stripHtmlTags } from '@/lib/html';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Alvion Digital Marketing',
    url: 'https://alviondigital.in',
    logo: 'https://alviondigital.in/Alvion%20Logo%20landsacpe.png',
    description: 'Full-service digital marketing agency specializing in Social Media Management, Content Strategy, Paid Advertising, and SEO.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-6230930041',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.instagram.com/alviondigitalmarketing/',
      'https://www.facebook.com/profile.php?id=61562935378228',
      'https://linkedin.com',
      'https://x.com/AlvionDigital',
    ],
  };
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Alvion Digital Marketing',
    url: 'https://alviondigital.in',
    description: "Alvion Digital helps businesses increase their online visibility, attract qualified leads, and drive long-term growth through SEO, social media management, paid advertising, content marketing, and web development. Every strategy and proposal is built around each client's business, goals, and the results they want to achieve, so their investment goes only toward work that actually helps their business grow.",
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://alviondigital.in/blog?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://alviondigital.in',
    name: 'Alvion Digital Marketing',
    image: 'https://alviondigital.in/Alvion%20Logo%20landsacpe.png',
    url: 'https://alviondigital.in',
    telephone: '+91-6230930041',
    email: 'contact@alviondigital.in',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 0,
      longitude: 0,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '1',
    },
  };
}

export function getServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Digital Marketing',
    provider: {
      '@type': 'Organization',
      name: 'Alvion Digital Marketing',
      url: 'https://alviondigital.in',
    },
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Digital Marketing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Social Media Management',
            description:
              'End-to-end social media management including content creation, scheduling, and analytics.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Content Strategy',
            description:
              'Brand storytelling, campaign creation, and content distribution.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Paid Advertising',
            description:
              'Data-driven paid advertising campaigns designed to generate leads, sales, and brand awareness.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'SEO',
            description:
              'Search engine optimization including technical audits, keyword research, and link building.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Web Development',
            description:
              'Modern, fast, and responsive websites built with clean UI/UX, optimized performance, and conversion-focused design.',
          },
        },
      ],
    },
  };
}

export function getBlogPostSchema(post: BlogPost) {
  const updatedAt = (post as any).updatedAt || post.publishedAt;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `https://alviondigital.in/opengraph-image`,
    datePublished: post.publishedAt,
    dateModified: updatedAt,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://alviondigital.in',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Alvion Digital Marketing',
      logo: {
        '@type': 'ImageObject',
        url: 'https://alviondigital.in/Alvion%20Logo%20landsacpe.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://alviondigital.in/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: [post.category, 'digital marketing', 'marketing strategy', 'content marketing'],
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What digital marketing services does Alvion offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Alvion Digital Marketing offers Social Media Management, Content Strategy, Paid Advertising, SEO services, and Web Development solutions to help businesses grow their online presence.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Alvion provide web development services?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Alvion Digital Marketing provides modern web development services including business websites, landing pages, SEO-friendly websites, responsive UI development, and performance-focused web solutions.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which social media platforms does Alvion manage?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We manage Instagram, Facebook, LinkedIn, and Twitter for our clients, with customized strategies for each platform.',
        },
      },
    ],
  };
}

export function getBlogFAQSchema(post: BlogPost) {
  const faqs = dedupeFaqEntries((((post as any)?.faqs || []) as BlogFaqItem[]))
    .map((faq) => {
      const question = stripHtmlTags(faq.question || '').replace(/\s+/g, ' ').trim();
      const answer = stripHtmlTags(faq.answer || '').replace(/\s+/g, ' ').trim();

      if (!question || !answer) return null;

      return {
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer,
        },
      };
    })
    .filter(Boolean);

  if (!faqs.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs,
  };
}
