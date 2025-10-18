# Vercel Blob Storage Setup Guide

Your blog now uses Vercel Blob Storage for file uploads, which means uploads will work seamlessly in production on Vercel.

## What Changed

- **Upload API** ([pages/api/upload.js](pages/api/upload.js)): Now uploads files to Vercel Blob instead of local filesystem
- **Delete API** ([pages/api/delete-upload.js](pages/api/delete-upload.js)): New API route to delete files from Vercel Blob
- **Environment Variables**: Added `BLOB_READ_WRITE_TOKEN` to `.env.local`

## Setup Instructions

### For Production (Vercel)

**Good news!** When you deploy to Vercel, the `BLOB_READ_WRITE_TOKEN` is automatically set for you. No manual configuration needed.

1. Push your code to GitHub
2. Deploy to Vercel (it will automatically detect and set up Blob storage)
3. Your uploads will work immediately

### For Local Development (Optional)

If you want to test uploads locally:

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Storage** tab
4. Click **Create Database** > **Blob**
5. Once created, go to **Settings** > **Environment Variables**
6. Copy the `BLOB_READ_WRITE_TOKEN` value
7. Paste it into your `.env.local` file:
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
   ```
8. Restart your development server

**Note:** You can skip local setup if you only upload files in production.

## Pricing

- **Free Tier**: 500 MB storage + 1 GB bandwidth/month
- Your current usage will likely stay well within the free tier
- Monitor usage at: https://vercel.com/dashboard/usage

## How It Works

When you upload a file:
1. File is temporarily stored by Next.js
2. File is uploaded to Vercel Blob Storage
3. A permanent URL is returned (e.g., `https://xxxxx.public.blob.vercel-storage.com/filename.jpg`)
4. This URL works in both development and production

## Migrating Existing Uploads

Your existing files in `/public/uploads/` will continue to work. However, new uploads will go to Vercel Blob.

If you want to migrate existing uploads:
1. They'll need to be manually uploaded through your admin interface, OR
2. Keep the old files in `/public/uploads/` (they'll deploy with your site)

## API Reference

### Upload File
```javascript
POST /api/upload
Content-Type: multipart/form-data

Response:
{
  "success": true,
  "filename": "image-1234567890.jpg",
  "url": "https://xxxxx.public.blob.vercel-storage.com/image-1234567890.jpg"
}
```

### Delete File
```javascript
DELETE /api/delete-upload
Content-Type: application/json

Body:
{
  "url": "https://xxxxx.public.blob.vercel-storage.com/image-1234567890.jpg"
}

Response:
{
  "success": true,
  "message": "File deleted successfully"
}
```

## Troubleshooting

**Error: "Missing Blob Store credentials"**
- In production: Redeploy your site (Vercel will auto-configure)
- In local: Add `BLOB_READ_WRITE_TOKEN` to `.env.local`

**Uploads work locally but not in production**
- Check Vercel dashboard > Storage to ensure Blob is enabled
- Check Environment Variables are set correctly

**Want to switch back to local storage?**
- Revert the changes in `pages/api/upload.js`
- Remove the `@vercel/blob` import and use the old filesystem code
