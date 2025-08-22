import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [, files] = await form.parse(req);

    const { file: fileField } = files;

    // Handle case where file might be an array
    const [file] = Array.isArray(fileField) ? fileField : [fileField];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.originalFilename || file.name || 'upload';
    const extension = path.extname(originalName);
    const basename = path.basename(originalName, extension);
    const newFilename = `${basename}-${timestamp}${extension}`;
    const newPath = path.join(uploadDir, newFilename);

    // Get the temporary file path (formidable v3 uses different property names)
    const tempPath = file.filepath || file.path;

    if (!tempPath) {
      return res.status(500).json({ error: 'Invalid file upload' });
    }

    // Move file to final location
    fs.renameSync(tempPath, newPath);

    // Return the public URL
    const publicUrl = `/uploads/${newFilename}`;

    return res.status(200).json({
      success: true,
      filename: newFilename,
      url: publicUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
}
