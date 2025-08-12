import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { archived } = req.query;
      // Get all posts for admin management
      const postsDir = archived === 'true'
        ? path.join(process.cwd(), 'archived-posts')
        : path.join(process.cwd(), 'posts');

      if (!fs.existsSync(postsDir)) {
        return res.status(200).json({ posts: [] });
      }

      const postFiles = fs.readdirSync(postsDir)
        .filter((file) => file.endsWith('.md'));

      const posts = postFiles.map((file) => {
        const slug = file.replace(/\.md$/, '');
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Extract metadata from frontmatter
        const match = fileContent.match(/^---\n([\s\S]*?)\n---/);
        if (match) {
          const frontmatter = match[1];
          const title = frontmatter.match(/title: "(.+)"/)?.[1] || slug;
          const date = frontmatter.match(/date: "(.+)"/)?.[1] || '';
          const excerpt = frontmatter.match(/excerpt: "(.+)"/)?.[1] || '';

          return {
            slug,
            title,
            date,
            excerpt,
            filePath: file,
          };
        }

        return {
          slug,
          title: slug,
          date: '',
          excerpt: '',
          filePath: file,
        };
      });

      // Sort by date, newest first
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      return res.status(200).json({ posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }
  } else if (req.method === 'PUT') {
    // Archive or unarchive a post
    try {
      const { slug, action } = req.body;

      if (!slug || !action) {
        return res.status(400).json({ error: 'Slug and action are required' });
      }

      const postsDir = path.join(process.cwd(), 'posts');
      const archivedDir = path.join(process.cwd(), 'archived-posts');

      // Ensure archived directory exists
      if (!fs.existsSync(archivedDir)) {
        fs.mkdirSync(archivedDir, { recursive: true });
      }

      if (action === 'archive') {
        // Move from posts to archived
        const sourcePath = path.join(postsDir, `${slug}.md`);
        const destPath = path.join(archivedDir, `${slug}.md`);

        if (!fs.existsSync(sourcePath)) {
          return res.status(404).json({ error: 'Post not found' });
        }

        const content = fs.readFileSync(sourcePath, 'utf8');
        fs.writeFileSync(destPath, content);
        fs.unlinkSync(sourcePath);

        return res.status(200).json({ message: 'Post archived successfully' });
      }
      if (action === 'unarchive') {
        // Move from archived to posts
        const sourcePath = path.join(archivedDir, `${slug}.md`);
        const destPath = path.join(postsDir, `${slug}.md`);

        if (!fs.existsSync(sourcePath)) {
          return res.status(404).json({ error: 'Archived post not found' });
        }

        const content = fs.readFileSync(sourcePath, 'utf8');
        fs.writeFileSync(destPath, content);
        fs.unlinkSync(sourcePath);

        return res.status(200).json({ message: 'Post unarchived successfully' });
      }
      return res.status(400).json({ error: 'Invalid action' });
    } catch (error) {
      console.error('Error archiving/unarchiving post:', error);
      return res.status(500).json({ error: 'Failed to archive/unarchive post' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { slug } = req.query;

      if (!slug) {
        return res.status(400).json({ error: 'Post slug is required' });
      }

      const postsDir = path.join(process.cwd(), 'posts');
      const archivedDir = path.join(process.cwd(), 'archived-posts');
      const postPath = path.join(postsDir, `${slug}.md`);
      const archivedPath = path.join(archivedDir, `${slug}.md`);

      // Check both locations
      let filePath = null;
      if (fs.existsSync(postPath)) {
        filePath = postPath;
      } else if (fs.existsSync(archivedPath)) {
        filePath = archivedPath;
      }

      if (!filePath) {
        return res.status(404).json({ error: 'Post not found' });
      }

      fs.unlinkSync(filePath);

      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        title, content, date, excerpt, draftId,
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

      // If this was published from a draft, delete the draft
      if (draftId) {
        const draftsDir = path.join(process.cwd(), 'drafts');
        const draftPath = path.join(draftsDir, `${draftId}.json`);
        if (fs.existsSync(draftPath)) {
          fs.unlinkSync(draftPath);
        }
      }

      res.status(200).json({ slug, message: 'Post created successfully' });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
