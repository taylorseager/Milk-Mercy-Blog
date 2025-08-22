import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const {
        originalSlug, title, content, date, excerpt,
      } = req.body;

      if (!originalSlug || !title || !content || !date) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Create new slug from updated title
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const postsDir = path.join(process.cwd(), 'posts');
      const archivedDir = path.join(process.cwd(), 'archived-posts');

      // Find the original file
      let originalPath = null;
      let targetDir = postsDir;
      const postPath = path.join(postsDir, `${originalSlug}.md`);
      const archivedPath = path.join(archivedDir, `${originalSlug}.md`);

      if (fs.existsSync(postPath)) {
        originalPath = postPath;
        targetDir = postsDir;
      } else if (fs.existsSync(archivedPath)) {
        originalPath = archivedPath;
        targetDir = archivedDir;
      }

      if (!originalPath) {
        return res.status(404).json({ error: 'Original post not found' });
      }

      // Create updated markdown content
      const markdownContent = `---
title: "${title}"
date: "${date}"
excerpt: "${excerpt}"
isHtml: true
---

${content}`;

      // Determine new file path
      const newPath = path.join(targetDir, `${newSlug}.md`);

      // If slug changed, check if new slug already exists
      if (originalSlug !== newSlug && fs.existsSync(newPath)) {
        return res.status(409).json({ error: 'A post with this title already exists' });
      }

      // Write the updated file
      fs.writeFileSync(newPath, markdownContent);

      // If slug changed, remove the old file
      if (originalSlug !== newSlug) {
        fs.unlinkSync(originalPath);
      }

      return res.status(200).json({
        slug: newSlug,
        message: 'Post updated successfully',
      });
    } catch (error) {
      console.error('Error updating post:', error);
      return res.status(500).json({ error: 'Failed to update post' });
    }
  }

  res.setHeader('Allow', ['PUT']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
