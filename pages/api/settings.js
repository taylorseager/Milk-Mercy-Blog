import { put, list, del } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

const SETTINGS_BLOB_PATHNAME = 'settings/settings.json';

const defaultSettings = {
  siteName: 'Milk & Mercy',
  tagline: 'Welcome to our blog',
  heroTitle: 'Welcome to Milk & Mercy',
  heroSubtitle: 'Discover amazing stories and insights',
  aboutText: 'This is a blog about interesting topics and thoughtful discussions.',
  footerText: 'All rights reserved.',
};

async function getSettingsFromBlob() {
  try {
    const { blobs } = await list({ prefix: 'settings/' });
    const settingsBlob = blobs.find((b) => b.pathname === SETTINGS_BLOB_PATHNAME);
    if (!settingsBlob) return null;

    const response = await fetch(settingsBlob.url);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function getSettingsFromFilesystem() {
  try {
    const settingsFile = path.join(process.cwd(), 'data', 'settings.json');
    if (fs.existsSync(settingsFile)) {
      return JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
    }
  } catch {
    // ignore
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Try Vercel Blob first, fall back to filesystem (covers initial migration)
      const settings = (await getSettingsFromBlob())
        || getSettingsFromFilesystem()
        || defaultSettings;
      return res.status(200).json(settings);
    } catch (error) {
      console.error('Error reading settings:', error);
      return res.status(500).json({ error: 'Failed to read settings' });
    }
  } else if (req.method === 'POST') {
    try {
      const updatedSettings = req.body;
      if (!updatedSettings.siteName) {
        return res.status(400).json({ error: 'Site name is required' });
      }

      // Get current settings to merge
      const currentSettings = (await getSettingsFromBlob())
        || getSettingsFromFilesystem()
        || defaultSettings;
      const newSettings = { ...currentSettings, ...updatedSettings };

      // Delete existing settings blob before writing new one
      const { blobs } = await list({ prefix: 'settings/' });
      const existingBlob = blobs.find((b) => b.pathname === SETTINGS_BLOB_PATHNAME);
      if (existingBlob) {
        await del(existingBlob.url);
      }

      // Save updated settings to Vercel Blob
      await put(SETTINGS_BLOB_PATHNAME, JSON.stringify(newSettings, null, 2), {
        access: 'public',
        addRandomSuffix: false,
      });

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
