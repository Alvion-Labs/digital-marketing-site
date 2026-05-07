# Blog System Guide - Alvion Digital Marketing Website

This guide explains how the blog system works, the data structure, and how to create new blog posts.

---

## 📁 File Structure

| File | Purpose |
|------|---------|
| `/lib/blog.ts` | Contains all blog data, TypeScript interfaces, and helper functions |
| `/app/blog/page.tsx` | Blog listing page |
| `/app/blog/[slug]/page.tsx` | Dynamic single blog post route |
| `/components/pages/blog/BlogPost.tsx` | Blog post UI component |
| `/components/pages/blog/BlogCard.tsx` | Blog card for listing pages |

---

## 📋 Blog Data Structure

All blog posts are defined in the `blogPosts` array inside `/lib/blog.ts` using the following TypeScript interfaces:

### `BlogPost` Interface (Main Blog Post)
```typescript
interface BlogPost {
  slug: string;            // URL friendly identifier (no spaces, lowercase, use dashes)
  title: string;           // Main blog post title
  excerpt: string;         // Short description for meta tags and listings
  category: string;        // Category name (Content Strategy, Paid Media, Social Media, SEO)
  publishedAt: string;     // Date in YYYY-MM-DD format
  readTime: string;        // Estimated reading time (e.g. "5 min read")
  author: string;          // Author name (usually "Alvion Digital Team")
  accentFrom: string;      // Starting hex color for gradients
  accentTo: string;        // Ending hex color for gradients
  summary: string;         // Longer summary shown below title on single post
  sections: BlogSection[]; // Array of content sections
  takeaways: string[];     // Array of key takeaway bullet points
}
```

### `BlogSection` Interface (Content Sections)
```typescript
interface BlogSection {
  heading: string;         // Section heading
  paragraphs: string[];    // Array of paragraph strings
  bullets?: string[];      // Optional: Array of bullet points
}
```

---

## ✨ Color Gradient Pairs

Use these approved gradient color combinations for consistency:

| Category | `accentFrom` | `accentTo` |
|----------|--------------|------------|
| Content Strategy | `#1E6BFF` | `#00A3FF` |
| Paid Media | `#0EA5E9` | `#22C55E` |
| Social Media | `#8B5CF6` | `#EC4899` |
| SEO | `#F59E0B` | `#EF4444` |

---

## 🚀 How to Create a New Blog Post

Follow these steps to add a new blog post:

### Step 1: Add new post to blog array

Open `/lib/blog.ts` and add a new object to the **START** of the `blogPosts` array (so newest posts appear first):

```typescript
{
  slug: 'your-blog-post-slug-here',
  title: 'Your Blog Post Title Goes Here',
  excerpt: 'Short description for listings and meta tags.',
  category: 'Content Strategy',
  publishedAt: '2026-05-01',
  readTime: '6 min read',
  author: 'Alvion Digital Team',
  accentFrom: '#1E6BFF',
  accentTo: '#00A3FF',
  summary: 'Longer summary that appears below the title on the single post page.',
  sections: [
    {
      heading: 'First Section Heading',
      paragraphs: [
        'First paragraph of content here.',
        'Second paragraph of content here.'
      ],
      bullets: [
        'Optional bullet point 1',
        'Optional bullet point 2',
        'Optional bullet point 3'
      ]
    },
    {
      heading: 'Second Section Heading',
      paragraphs: [
        'Paragraph for second section.'
      ]
    }
  ],
  takeaways: [
    'First key takeaway point',
    'Second key takeaway point',
    'Third key takeaway point'
  ]
},
```

### Step 2: Important Guidelines

✅ **Slug Rules:**
- Use only lowercase letters, numbers and dashes
- No spaces, special characters or uppercase letters
- Must be unique across all blog posts
- Example: `how-to-improve-seo-rankings`

✅ **Content Best Practices:**
- Write 2-4 sections per blog post
- Each section should have 1-3 paragraphs
- Add bullet points where it makes sense
- Keep paragraphs short (2-4 lines) for readability
- Use clear, descriptive headings
- Always include 3 key takeaways

✅ **Dates:**
- Always use `YYYY-MM-DD` format for `publishedAt`
- Newest posts should be added to the TOP of the array

---

## 🧪 After Adding a Post

1. Save the file
2. The blog system will automatically:
   - Add the post to the blog listing page
   - Generate the single post page at `/blog/[slug]`
   - Update meta tags and SEO information
   - Include the post in sitemap generation
3. No other files need to be modified

---

## 🔍 Helper Functions

| Function | Usage |
|----------|-------|
| `getAllBlogPosts()` | Returns all blog posts sorted by newest first |
| `getFeaturedBlogPosts(limit)` | Returns latest N posts (default 3) for homepage |
| `getBlogPostBySlug(slug)` | Finds a single post by its slug |
| `formatBlogDate(date)` | Formats date string to human readable format |

---

## 📝 Example Complete Post

You can copy the existing posts in the `blogPosts` array as templates. Each existing post follows the exact structure and provides a good reference for styling, tone and formatting.

All changes are automatically picked up by Next.js and static pages will be regenerated during build time.