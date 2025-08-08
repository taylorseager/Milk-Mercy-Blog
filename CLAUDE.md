# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js blog application called "Milk & Mercy" that uses markdown files for content management. The blog features a clean, minimalist design with support for markdown blog posts, dynamic routing, and static site generation.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Setup git hooks (run once after cloning)
npm run prepare
```

## Architecture

### File Structure
- **pages/** - Next.js pages and routes
  - `index.js` - Homepage displaying blog post list
  - `about.js` - About page
  - `blog/[slug].js` - Dynamic route for individual blog posts
  - `_app.js` - App wrapper with Layout component
  
- **components/** - React components
  - `Layout.js` - Main layout wrapper with header/footer
  - `Header.js` - Site navigation
  - `Footer.js` - Site footer
  - `BlogCard.js` - Blog post preview card

- **lib/** - Utility functions
  - `posts.js` - Functions for reading and processing markdown posts

- **posts/** - Markdown blog posts directory
  - Blog posts as `.md` files with frontmatter

- **styles/** - CSS styles
  - `globals.css` - Global styles and component styling

### Content Management
Blog posts are stored as markdown files in the `/posts` directory. Each post should include frontmatter with:
```markdown
---
title: "Post Title"
date: "YYYY-MM-DD"
excerpt: "Brief description of the post"
---

Post content in markdown...
```

### Key Technologies
- **Next.js 12** - React framework with SSG/SSR
- **gray-matter** - Parse frontmatter from markdown
- **remark** - Process markdown to HTML
- **ESLint** - Code linting with Airbnb config

## Adding New Blog Posts

1. Create a new `.md` file in `/posts` directory
2. Add frontmatter with title, date, and excerpt
3. Write content in markdown format
4. The post will automatically appear on the homepage

## Code Quality
- ESLint configured with Airbnb style guide
- Prettier for code formatting  
- Husky pre-commit hooks run linting automatically
- Lint-staged ensures only changed files are linted
