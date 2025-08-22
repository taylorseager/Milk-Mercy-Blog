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
    const form = new IncomingForm();
    form.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    form.keepExtensions = true;
    form.maxFileSize = 10 * 1024 * 1024; // 10MB limit

    // Ensure upload directory exists
    if (!fs.existsSync(form.uploadDir)) {
      fs.mkdirSync(form.uploadDir, { recursive: true });
    }

    const [, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, formFields, formFiles) => {
        if (err) reject(err);
        else resolve([formFields, formFiles]);
      });
    });

    const { file } = files;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.originalFilename || 'upload';
    const extension = path.extname(originalName);
    const basename = path.basename(originalName, extension);
    const newFilename = `${basename}-${timestamp}${extension}`;
    const newPath = path.join(form.uploadDir, newFilename);

    // Move file to final location
    fs.renameSync(file.filepath, newPath);

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
