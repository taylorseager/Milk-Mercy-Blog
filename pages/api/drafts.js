import fs from 'fs';
import path from 'path';

const draftsDirectory = path.join(process.cwd(), 'drafts');

// Ensure drafts directory exists
if (!fs.existsSync(draftsDirectory)) {
  fs.mkdirSync(draftsDirectory, { recursive: true });
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;

      if (id) {
        // Get single draft
        const draftPath = path.join(draftsDirectory, `${id}.json`);
        if (!fs.existsSync(draftPath)) {
          res.status(404).json({ error: 'Draft not found' });
          return;
        }

        const draftData = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
        res.status(200).json(draftData);
        return;
      }

      // Get all drafts
      const draftFiles = fs.readdirSync(draftsDirectory)
        .filter((file) => file.endsWith('.json'));

      const drafts = draftFiles.map((file) => {
        const filePath = path.join(draftsDirectory, file);
        const draftData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return draftData;
      });

      // Sort by lastModified, newest first
      drafts.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

      res.status(200).json(drafts);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      res.status(500).json({ error: 'Failed to fetch drafts' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        id, title, content, lastModified,
      } = req.body;

      let draftId = id;
      if (!draftId) {
        // Generate new ID based on timestamp
        draftId = `draft_${Date.now()}`;
      }

      const draftData = {
        id: draftId,
        title,
        content,
        lastModified,
      };

      const draftPath = path.join(draftsDirectory, `${draftId}.json`);
      fs.writeFileSync(draftPath, JSON.stringify(draftData, null, 2));

      res.status(200).json({ id: draftId, message: 'Draft saved successfully' });
    } catch (error) {
      console.error('Error saving draft:', error);
      res.status(500).json({ error: 'Failed to save draft' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        res.status(400).json({ error: 'Draft ID is required' });
        return;
      }

      const draftPath = path.join(draftsDirectory, `${id}.json`);

      if (!fs.existsSync(draftPath)) {
        res.status(404).json({ error: 'Draft not found' });
        return;
      }

      fs.unlinkSync(draftPath);
      res.status(200).json({ message: 'Draft deleted successfully' });
    } catch (error) {
      console.error('Error deleting draft:', error);
      res.status(500).json({ error: 'Failed to delete draft' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
