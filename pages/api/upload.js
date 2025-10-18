import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to convert request to buffer
function bufferRequest(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    });
    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    req.on('error', reject);
  });
}

// Parse multipart form data
function parseMultipart(buffer, boundary) {
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const parts = [];
  let start = 0;

  while (start < buffer.length) {
    const boundaryIndex = buffer.indexOf(boundaryBuffer, start);
    if (boundaryIndex === -1) {
      break;
    }

    const nextBoundaryIndex = buffer.indexOf(boundaryBuffer, boundaryIndex + boundaryBuffer.length);
    if (nextBoundaryIndex === -1) {
      break;
    }

    const partBuffer = buffer.slice(boundaryIndex + boundaryBuffer.length, nextBoundaryIndex);

    // Find the header/body separator (\r\n\r\n)
    const headerEnd = partBuffer.indexOf('\r\n\r\n');
    if (headerEnd !== -1) {
      const headers = partBuffer.slice(0, headerEnd).toString();
      const body = partBuffer.slice(headerEnd + 4, partBuffer.length - 2); // -2 to remove trailing \r\n

      // Extract filename from Content-Disposition header
      const filenameMatch = headers.match(/filename="(.+?)"/);
      if (filenameMatch) {
        parts.push({
          filename: filenameMatch[1],
          buffer: body,
        });
      }
    }

    start = nextBoundaryIndex;
  }

  return parts;
}

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
    // Get boundary from content-type header
    const contentType = req.headers['content-type'];
    const boundaryMatch = contentType?.match(/boundary=(.+)$/);

    if (!boundaryMatch) {
      return res.status(400).json({ error: 'No boundary found in multipart form data' });
    }

    const boundary = boundaryMatch[1];

    // Read the entire request body
    const buffer = await bufferRequest(req);

    // Parse the multipart data
    const parts = parseMultipart(buffer, boundary);

    if (parts.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { filename, buffer: fileBuffer } = parts[0];

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
