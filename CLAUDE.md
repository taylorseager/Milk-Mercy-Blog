# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Milk & Honehy** — a Next.js 15 blog built with the App Router, TypeScript, and Tailwind CSS v4. Deployed to Vercel.

## Development Commands

```bash
npm install       # Install dependencies
npm run dev       # Run development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run linting
```

## Architecture

### File Structure

```
src/
  app/
    layout.tsx          Root layout — fonts, AdSense script, Header, Footer
    globals.css         Global styles + prose styles for blog content
    page.tsx            Home page — welcome section + 4 most recent posts
    blog/[slug]/
      page.tsx          Individual blog post — title, date, content, AdSense sidebars
    contact/
      page.tsx          Contact form (Formspree) with validation
  components/
    Header.tsx          Site header with logo and nav
    Footer.tsx          Site footer
    BlogCard.tsx        Blog post preview card used on home page
    AdSenseUnit.tsx     Google AdSense unit (client component)
  lib/
    posts.ts            Utilities for reading/processing markdown posts

content/
  posts/                Markdown blog post files (.md)

public/
  logo.svg              Logo placeholder — replace with your actual logo file
```

### Adding New Blog Posts

1. Create a `.md` file in `content/posts/`
2. Add frontmatter at the top:

```markdown
---
title: "Your Post Title"
date: "YYYY-MM-DD"
excerpt: "A short description shown on the home page card."
---

Your content here in markdown...
```

3. The post automatically appears on the homepage (sorted newest first, top 4 shown) and gets its own page at `/blog/your-file-name`.

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` | Google AdSense publisher ID |
| `NEXT_PUBLIC_ADSENSE_AD_SLOT_LEFT` | Left sidebar ad slot ID |
| `NEXT_PUBLIC_ADSENSE_AD_SLOT_RIGHT` | Right sidebar ad slot ID |
| `NEXT_PUBLIC_FORMSPREE_FORM_ID` | Formspree form ID for contact page |

### Logo

Replace `public/logo.svg` with your actual logo file. Supported formats: `.svg`, `.png`, `.jpg`. If using a raster image, update the `src` and `width`/`height` in `src/components/Header.tsx`.

### Google AdSense

- Without `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` set, ad slots show an invisible placeholder (no visual impact).
- Blog posts use a 3-column layout on large screens: left ad | content | right ad.
- Ads are hidden on mobile/tablet.

### Contact Form (Formspree)

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form — copy the form ID from the endpoint URL
3. Set `NEXT_PUBLIC_FORMSPREE_FORM_ID` in `.env.local`

The form validates: name (required), email (format check), message (required). The email consent checkbox is optional but tracked in the submission.

### Key Technologies

- **Next.js 16 / React 19** — App Router, Server Components, static generation
- **TypeScript** — full type safety
- **Tailwind CSS v4** — utility-first styling
- **gray-matter** — parse markdown frontmatter
- **remark + remark-html** — render markdown to HTML
- **Google Fonts** — Playfair Display (serif headings) + Inter (body)
