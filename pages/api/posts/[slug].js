import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { slug } = req.query;

      if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
      }

      const postsDir = path.join(process.cwd(), 'posts');
      const archivedDir = path.join(process.cwd(), 'archived-posts');

      let filePath = null;
      const postPath = path.join(postsDir, `${slug}.md`);
      const archivedPath = path.join(archivedDir, `${slug}.md`);

      // Check both locations
      if (fs.existsSync(postPath)) {
        filePath = postPath;
      } else if (fs.existsSync(archivedPath)) {
        filePath = archivedPath;
      }

      if (!filePath) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const fileContent = fs.readFileSync(filePath, 'utf8');

      // Extract metadata from frontmatter
      const match = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!match) {
        return res.status(500).json({ error: 'Invalid post format' });
      }

      const frontmatter = match[1];
      const content = match[2];

      const title = frontmatter.match(/title: "(.+)"/)?.[1] || slug;
      const date = frontmatter.match(/date: "(.+)"/)?.[1] || '';
      const excerpt = frontmatter.match(/excerpt: "(.+)"/)?.[1] || '';

      return res.status(200).json({
        slug,
        title,
        date,
        excerpt,
        contentHtml: content,
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      return res.status(500).json({ error: 'Failed to fetch post' });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
