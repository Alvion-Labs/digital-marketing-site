import { BlogPost } from '@/lib/blog';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Alvion Digital Marketing',
    url: 'https://alviondigital.com',
    logo: 'https://alviondigital.com/AlvionLogo.png',
    description: 'Full-service digital marketing agency specializing in Social Media Management, Content Strategy, Google & Meta Ads, and SEO.',
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
      'https://twitter.com',
    ],
  };
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Alvion Digital Marketing',
    url: 'https://alviondigital.com',
    description: 'Crafting digital presence that actually works. Expert digital marketing services including social media management, SEO, and paid advertising.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://alviondigital.com/blog?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://alviondigital.com',
    name: 'Alvion Digital Marketing',
    image: 'https://alviondigital.com/AlvionLogo.png',
    url: 'https://alviondigital.com',
    telephone: '+91-6230930041',
    email: 'thakursureshkumar118@gmail.com',
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
      url: 'https://alviondigital.com',
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Digital Marketing Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Social Media Management',
            description: 'End-to-end social media management including content creation, scheduling, and analytics.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Content Strategy',
            description: 'Brand storytelling, campaign creation, and content distribution.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Google & Meta Ads',
            description: 'Data-driven advertising campaigns on Google and Meta platforms.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'SEO',
            description: 'Search engine optimization including technical audits, keyword research, and link building.',
          },
        },
      ],
    },
  };
}

export function getBlogPostSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `https://alviondigital.com/og-image.png`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://alviondigital.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Alvion Digital Marketing',
      logo: {
        '@type': 'ImageObject',
        url: 'https://alviondigital.com/AlvionLogo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://alviondigital.com/blog/${post.slug}`,
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
          text: 'Alvion Digital Marketing offers Social Media Management, Content Strategy, Google & Meta Ads, and SEO services to help businesses grow their online presence.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much do Alvion digital marketing services cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer three pricing tiers: Starter at ₹9,999/month, Growth at ₹24,999/month, and Scale at ₹49,999/month. Each plan includes different levels of service and support.',
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
