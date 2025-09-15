import fs from 'fs';
import path from 'path';

const contactDirectory = path.join(process.cwd(), 'data', 'contact');

// Ensure contact directory exists
if (!fs.existsSync(contactDirectory)) {
  fs.mkdirSync(contactDirectory, { recursive: true });
}

// Generate unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        // Get all contact submissions (for admin)
        const contactFile = path.join(contactDirectory, 'submissions.json');
        if (!fs.existsSync(contactFile)) {
          return res.status(200).json({ submissions: [] });
        }

        const contactData = JSON.parse(fs.readFileSync(contactFile, 'utf8'));
        const submissions = contactData.submissions || [];

        // Sort by date, newest first
        submissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return res.status(200).json({ submissions });
      }

      case 'POST': {
        const {
          name, email, message, allowEmailContact,
        } = req.body;

        if (!name || !email || !message) {
          return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        // Email validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: 'Please enter a valid email address' });
        }

        if (name.trim().length < 2) {
          return res.status(400).json({ error: 'Name must be at least 2 characters long' });
        }

        if (message.trim().length < 10) {
          return res.status(400).json({ error: 'Message must be at least 10 characters long' });
        }

        if (message.length > 2000) {
          return res.status(400).json({ error: 'Message too long (max 2000 characters)' });
        }

        const contactFile = path.join(contactDirectory, 'submissions.json');
        let contactData = { submissions: [] };
        if (fs.existsSync(contactFile)) {
          contactData = JSON.parse(fs.readFileSync(contactFile, 'utf8'));
        }

        const newSubmission = {
          id: generateId(),
          name: name.trim(),
          email: email.trim().toLowerCase(),
          message: message.trim(),
          allowEmailContact: allowEmailContact !== false, // Default to true if not provided
          createdAt: new Date().toISOString(),
          read: false,
          replied: false,
        };

        contactData.submissions = contactData.submissions || [];
        contactData.submissions.push(newSubmission);

        fs.writeFileSync(contactFile, JSON.stringify(contactData, null, 2));
        return res.status(201).json({ message: 'Message sent successfully' });
      }

      case 'PATCH': {
        // Mark submission as read/unread or replied/not replied
        const { id, read, replied } = req.body;

        if (!id || (typeof read !== 'boolean' && typeof replied !== 'boolean')) {
          return res.status(400).json({ error: 'Invalid request' });
        }

        const contactFile = path.join(contactDirectory, 'submissions.json');
        if (!fs.existsSync(contactFile)) {
          return res.status(404).json({ error: 'No submissions found' });
        }

        const contactData = JSON.parse(fs.readFileSync(contactFile, 'utf8'));
        const submission = contactData.submissions?.find((sub) => sub.id === id);

        if (!submission) {
          return res.status(404).json({ error: 'Submission not found' });
        }

        if (typeof read === 'boolean') {
          submission.read = read;
        }
        if (typeof replied === 'boolean') {
          submission.replied = replied;
        }

        fs.writeFileSync(contactFile, JSON.stringify(contactData, null, 2));
        return res.status(200).json({ message: 'Submission updated' });
      }

      case 'DELETE': {
        // Delete submission
        const { id } = req.body;

        if (!id) {
          return res.status(400).json({ error: 'Submission ID is required' });
        }

        const contactFile = path.join(contactDirectory, 'submissions.json');
        if (!fs.existsSync(contactFile)) {
          return res.status(404).json({ error: 'No submissions found' });
        }

        const contactData = JSON.parse(fs.readFileSync(contactFile, 'utf8'));
        const initialLength = contactData.submissions?.length || 0;
        contactData.submissions = contactData.submissions?.filter((sub) => sub.id !== id) || [];

        if (contactData.submissions.length === initialLength) {
          return res.status(404).json({ error: 'Submission not found' });
        }

        fs.writeFileSync(contactFile, JSON.stringify(contactData, null, 2));
        return res.status(200).json({ message: 'Submission deleted' });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} not allowed` });
    }
  } catch (error) {
    console.error('Contact API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
