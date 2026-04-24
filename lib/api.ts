export interface SocialPost {
  id: string;
  imageUrl: string;
  caption: string;
  platform: 'instagram' | 'facebook';
  date: string;
  likes: number;
  link: string;
}

export const mockInstagramPosts: SocialPost[] = [
  {
    id: 'ig1',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80',
    caption: 'Boosting your brand visibility with targeted social media strategies that convert followers into customers. 🚀 #DigitalMarketing',
    platform: 'instagram',
    date: '2024-01-15',
    likes: 342,
    link: '#',
  },
  {
    id: 'ig2',
    imageUrl: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&q=80',
    caption: 'Content is king, but distribution is queen. Let us handle both for your business growth. 👑 #ContentStrategy',
    platform: 'instagram',
    date: '2024-01-12',
    likes: 287,
    link: '#',
  },
  {
    id: 'ig3',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
    caption: 'Data-driven decisions lead to measurable results. See how our SEO strategies tripled organic traffic. 📈 #SEO',
    platform: 'instagram',
    date: '2024-01-10',
    likes: 415,
    link: '#',
  },
  {
    id: 'ig4',
    imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&q=80',
    caption: 'Your audience is waiting. Our Google & Meta Ads campaigns deliver real ROI for your marketing budget. 💡 #PaidAds',
    platform: 'instagram',
    date: '2024-01-08',
    likes: 198,
    link: '#',
  },
  {
    id: 'ig5',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80',
    caption: "Behind every successful brand is a powerful digital strategy. Let's build yours together. ✨ #BrandBuilding",
    platform: 'instagram',
    date: '2024-01-05',
    likes: 523,
    link: '#',
  },
  {
    id: 'ig6',
    imageUrl: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&q=80',
    caption: 'Engagement rate matters more than follower count. Our social media management focuses on quality connections. 🤝 #SocialMedia',
    platform: 'instagram',
    date: '2024-01-03',
    likes: 376,
    link: '#',
  },
];

export const mockFacebookPosts: SocialPost[] = [
  {
    id: 'fb1',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
    caption: "Transform your digital presence with our comprehensive marketing solutions. From strategy to execution, we've got you covered. 🎯",
    platform: 'facebook',
    date: '2024-01-14',
    likes: 156,
    link: '#',
  },
  {
    id: 'fb2',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
    caption: 'Our clients see an average 3x increase in leads within the first 90 days. Ready to grow your business? Contact us today!',
    platform: 'facebook',
    date: '2024-01-11',
    likes: 203,
    link: '#',
  },
  {
    id: 'fb3',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80',
    caption: "Social media is not just about posting — it's about building relationships. Our team creates content that resonates. 💬",
    platform: 'facebook',
    date: '2024-01-09',
    likes: 178,
    link: '#',
  },
  {
    id: 'fb4',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
    caption: 'New year, new marketing goals! Let 2024 be the year your business truly thrives online. Get in touch for a free consultation.',
    platform: 'facebook',
    date: '2024-01-07',
    likes: 312,
    link: '#',
  },
  {
    id: 'fb5',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80',
    caption: 'Behind the scenes: Our team crafting the perfect content calendar for a client in the hospitality industry. 🏨',
    platform: 'facebook',
    date: '2024-01-04',
    likes: 145,
    link: '#',
  },
  {
    id: 'fb6',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80',
    caption: 'Case study: How we helped a local restaurant increase their online orders by 250% in just 3 months. Read more! 🍽️',
    platform: 'facebook',
    date: '2024-01-02',
    likes: 267,
    link: '#',
  },
];

export async function fetchInstagramPosts(): Promise<SocialPost[]> {
  // TODO: Replace with real Instagram Graph API call
  return mockInstagramPosts;
}

export async function fetchFacebookPosts(): Promise<SocialPost[]> {
  // TODO: Replace with real Facebook Graph API call
  return mockFacebookPosts;
}
