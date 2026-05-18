# Alvion Digital Marketing

A complete Next.js 16 App Router landing page for **Alvion Digital Marketing**.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 with custom theme via `@theme` directive
- **Language**: TypeScript
- **Font**: System font stack (Inter, ui-sans-serif, system-ui, and OS fallbacks)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Home page
├── components/
│   ├── global/            # Shared components (Navbar, Footer, Button, Container)
│   └── pages/home/        # Page-specific sections (Hero, Services, SocialGallery, Contact)
├── lib/
│   └── api.ts             # Mock social media data + API interfaces
└── styles/
    └── globals.css        # Tailwind v4 theme config + custom utilities
```

## Sections

- **Navbar** — Sticky with glass blur effect and mobile hamburger menu
- **Hero** — Headline, CTA buttons, animated gradient blobs, stats grid
- **Services** — Social Media,  Paid Advertising, SEO, Web Development
- **Social Gallery** — Tabbed Instagram/Facebook post feed (mock data)
- **Contact** — Validated contact form + WhatsApp and mailto links
- **Footer** — Social links, quick nav, contact info

## Build

```bash
npm run build
```
