/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.alviondigital.in',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/api/*',
    '/404',
    '/500',
    '/admin',
    '/admin/*',
    '/opengraph-image',
    '/twitter-image',
    '/sitemap.xml',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  transform: async (config, path) => ({
    loc: path,
    changefreq: path === '/' ? 'daily' : config.changefreq,
    priority: path === '/' ? 1 : config.priority,
    lastmod: new Date().toISOString(),
    alternateRefs: config.alternateRefs ?? [],
  }),
};
