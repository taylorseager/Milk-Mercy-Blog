import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        title, content, date, excerpt,
      } = req.body;

      // Create slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Create markdown content with HTML preserved
      const markdownContent = `---
title: "${title}"
date: "${date}"
excerpt: "${excerpt}"
isHtml: true
---

${content}`;

      // Ensure posts directory exists
      const postsDir = path.join(process.cwd(), 'posts');
      if (!fs.existsSync(postsDir)) {
        fs.mkdirSync(postsDir, { recursive: true });
      }

      // Write the file
      const filePath = path.join(postsDir, `${slug}.md`);
      fs.writeFileSync(filePath, markdownContent);

      res.status(200).json({ slug, message: 'Post created successfully' });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
