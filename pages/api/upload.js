import { put } from '@vercel/blob';
import Busboy from 'busboy';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
  maxDuration: 60, // Allow up to 60 seconds for upload
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

  console.log('Upload started - Content-Type:', req.headers['content-type']);

  try {
    const { fileBuffer, filename } = await new Promise((resolve, reject) => {
      const busboy = Busboy({
        headers: req.headers,
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB limit
        },
      });
      let uploadedFile = null;
      let hasError = false;

      busboy.on('file', (fieldname, file, info) => {
        console.log('File detected:', info.filename);
        const { filename: originalFilename } = info;
        const chunks = [];

        file.on('data', (data) => {
          chunks.push(data);
        });

        file.on('limit', () => {
          hasError = true;
          reject(new Error('File size exceeds 10MB limit'));
        });

        file.on('end', () => {
          if (!hasError) {
            uploadedFile = {
              fileBuffer: Buffer.concat(chunks),
              filename: originalFilename,
            };
            console.log('File buffered:', originalFilename, 'Size:', uploadedFile.fileBuffer.length);
          }
        });

        file.on('error', (err) => {
          hasError = true;
          reject(err);
        });
      });

      busboy.on('finish', () => {
        if (hasError) {
          return;
        }
        if (!uploadedFile) {
          reject(new Error('No file uploaded'));
        } else {
          console.log('Busboy finished processing');
          resolve(uploadedFile);
        }
      });

      busboy.on('error', (error) => {
        console.error('Busboy error:', error);
        reject(error);
      });

      req.pipe(busboy);
    });

    console.log('File parsed successfully, uploading to Vercel Blob...');

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

    console.log('Upload successful:', blob.url);

    return res.status(200).json({
      success: true,
      filename: newFilename,
      url: blob.url,
    });
  } catch (error) {
    console.error('Upload error:', error.message, error.stack);
    return res.status(500).json({
      error: 'Failed to upload file',
      details: error.message,
    });
  }
}
