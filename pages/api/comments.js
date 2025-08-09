import fs from 'fs';
import path from 'path';

const commentsDirectory = path.join(process.cwd(), 'data', 'comments');

// Ensure comments directory exists
if (!fs.existsSync(commentsDirectory)) {
  fs.mkdirSync(commentsDirectory, { recursive: true });
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { slug } = req.query;

      if (!slug) {
        return res.status(400).json({ error: 'Post slug is required' });
      }

      const commentsFile = path.join(commentsDirectory, `${slug}.json`);
      if (!fs.existsSync(commentsFile)) {
        return res.status(200).json({ comments: [] });
      }

      const commentsData = JSON.parse(fs.readFileSync(commentsFile, 'utf8'));
      const comments = commentsData.comments || [];

      // Sort comments by date, newest first
      comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json({ comments });
    } catch (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
  } else if (req.method === 'POST') {
    try {
      const { slug, comment, username } = req.body;

      if (!slug || !comment || !username) {
        return res.status(400).json({ error: 'Slug, comment, and username are required' });
      }

      if (comment.trim().length < 1) {
        return res.status(400).json({ error: 'Comment cannot be empty' });
      }

      if (comment.length > 1000) {
        return res.status(400).json({ error: 'Comment too long (max 1000 characters)' });
      }

      const commentsFile = path.join(commentsDirectory, `${slug}.json`);
      let commentsData = { comments: [] };
      if (fs.existsSync(commentsFile)) {
        commentsData = JSON.parse(fs.readFileSync(commentsFile, 'utf8'));
      }

      const newComment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        username: username.trim(),
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      };

      commentsData.comments = commentsData.comments || [];
      commentsData.comments.push(newComment);

      fs.writeFileSync(commentsFile, JSON.stringify(commentsData, null, 2));

      return res.status(201).json({
        comment: newComment,
        message: 'Comment added successfully',
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      return res.status(500).json({ error: 'Failed to add comment' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
