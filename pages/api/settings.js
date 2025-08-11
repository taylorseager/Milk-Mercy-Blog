import fs from 'fs';
import path from 'path';

const settingsFile = path.join(process.cwd(), 'data', 'settings.json');
const dataDir = path.join(process.cwd(), 'data');

// Default settings
const defaultSettings = {
  siteName: 'Milk & Mercy',
  tagline: 'Welcome to our blog',
  heroTitle: 'Welcome to Milk & Mercy',
  heroSubtitle: 'Discover amazing stories and insights',
  aboutText: 'This is a blog about interesting topics and thoughtful discussions.',
  footerText: 'All rights reserved.',
};

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize settings file with defaults if it doesn't exist
if (!fs.existsSync(settingsFile)) {
  fs.writeFileSync(settingsFile, JSON.stringify(defaultSettings, null, 2));
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
      return res.status(200).json(settings);
    } catch (error) {
      console.error('Error reading settings:', error);
      return res.status(500).json({ error: 'Failed to read settings' });
    }
  } else if (req.method === 'POST') {
    try {
      const updatedSettings = req.body;
      // Validate that we have the required fields
      if (!updatedSettings.siteName) {
        return res.status(400).json({ error: 'Site name is required' });
      }

      // Merge with existing settings to preserve any fields not being updated
      const currentSettings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
      const newSettings = { ...currentSettings, ...updatedSettings };

      fs.writeFileSync(settingsFile, JSON.stringify(newSettings, null, 2));
      return res.status(200).json({
        message: 'Settings updated successfully',
        settings: newSettings,
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      return res.status(500).json({ error: 'Failed to update settings' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
