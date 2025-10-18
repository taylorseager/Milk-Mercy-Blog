import { put } from '@vercel/blob';
import Busboy from 'busboy';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { fileBuffer, filename } = await new Promise((resolve, reject) => {
      const busboy = Busboy({ headers: req.headers });
      let uploadedFile = null;

      busboy.on('file', (fieldname, file, info) => {
        const { filename: originalFilename } = info;
        const chunks = [];

        file.on('data', (data) => {
          chunks.push(data);
        });

        file.on('end', () => {
          uploadedFile = {
            fileBuffer: Buffer.concat(chunks),
            filename: originalFilename,
          };
        });
      });

      busboy.on('finish', () => {
        if (!uploadedFile) {
          reject(new Error('No file uploaded'));
        } else {
          resolve(uploadedFile);
        }
      });

      busboy.on('error', (error) => {
        reject(error);
      });

      req.pipe(busboy);
    });

    // Validate file size (10MB max)
    if (fileBuffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 10MB limit' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = filename.includes('.') ? `.${filename.split('.').pop()}` : '';
    const basename = filename.replace(extension, '');
    const newFilename = `${basename}-${timestamp}${extension}`;

    // Upload to Vercel Blob
    const blob = await put(newFilename, fileBuffer, {
      access: 'public',
      addRandomSuffix: false,
    });

    return res.status(200).json({
      success: true,
      filename: newFilename,
      url: blob.url,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      error: 'Failed to upload file',
      details: error.message,
    });
  }
}
