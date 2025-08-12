/* eslint-disable react/no-danger */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draftId, setDraftId] = useState(null);

  const loadDraft = async (id) => {
    try {
      const response = await fetch(`/api/drafts?id=${id}`);
      if (response.ok) {
        const draftData = await response.json();
        setTitle(draftData.title);
        setContent(draftData.content);
        setDraftId(id);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('adminAuth');
      if (!isAuth) {
        router.push('/admin');
      }
    }

    // Check if editing existing draft
    const { draft } = router.query;
    if (draft) {
      loadDraft(draft);
    }
  }, [router]);

  const sizeOptions = [];
  for (let i = 10; i <= 150; i += 5) {
    sizeOptions.push(`${i}pt`);
  }

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: sizeOptions }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        [{ indent: '-1' }, { indent: '+1' }],
        ['clean'],
      ],
      handlers: {},
    },
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'align',
    'list',
    'bullet',
    'blockquote',
    'code-block',
    'link',
    'image',
    'video',
    'indent',
  ];

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: draftId,
          title,
          content,
          lastModified: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDraftId(data.id);
        alert('Draft saved successfully!');
      } else {
        alert('Failed to save draft. Please try again.');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Please enter both title and content');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          date: new Date().toISOString().split('T')[0],
          excerpt: content.replace(/<[^>]*>/g, '').substring(0, 150),
          draftId, // Include draft ID to delete after publishing
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/blog/${data.slug}`);
      } else {
        alert('Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create New Post - Milk & Mercy Admin</title>
      </Head>

      <div className="admin-container">
        <h1>Create New Blog Post</h1>

        <form onSubmit={handlePublish} className="post-form">
          <div className="form-group">
            <label htmlFor="title">Post Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog post title..."
              className="title-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Post Content</label>
            <div className="editor-wrapper">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                placeholder="Write your blog post here..."
                className="editor"
              />
            </div>
          </div>
        </form>

        <div className="button-container">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="save-button"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/drafts')}
            className="drafts-button"
          >
            View Drafts
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting}
            className="publish-button"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        h1 {
          color: var(--primary-color);
          margin-bottom: 40px;
        }

        .post-form {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 30px;
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 30px;
        }

        label {
          display: block;
          font-weight: 600;
          margin-bottom: 10px;
          color: var(--primary-color);
        }

        .title-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 18px;
          border: 2px solid #e1e4e8;
          border-radius: 4px;
          transition: border-color 0.2s;
        }

        .title-input:focus {
          outline: none;
          border-color: var(--link-color);
        }

        .editor-wrapper {
          border: 2px solid #e1e4e8;
          border-radius: 4px;
          overflow: hidden;
        }

        .button-container {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          padding: 20px 30px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .save-button {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 12px 30px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .save-button:hover:not(:disabled) {
          background-color: #218838;
        }

        .drafts-button {
          background-color: #6c757d;
          color: white;
          border: none;
          padding: 12px 30px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .drafts-button:hover {
          background-color: #5a6268;
        }

        .publish-button {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 12px 30px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .publish-button:hover:not(:disabled) {
          background-color: #c82333;
        }

        .save-button:disabled,
        .publish-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .button-container {
            flex-direction: column;
          }

          .save-button,
          .drafts-button,
          .publish-button {
            width: 100%;
          }
        }
      `}
      </style>

      <style jsx global>{`
        .editor .ql-container {
          min-height: 400px;
          font-size: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans',
            'Helvetica Neue', sans-serif;
        }

        .editor .ql-editor {
          min-height: 400px;
          line-height: 1.6;
        }

        .editor .ql-toolbar {
          border: none;
          border-bottom: 2px solid #e1e4e8;
          background: #f8f9fa;
        }

        .editor .ql-container {
          border: none;
        }

        .editor-wrapper:focus-within {
          border-color: var(--link-color);
        }

        /* Tooltips for editor buttons */
        .ql-toolbar button {
          position: relative;
        }

        .ql-toolbar button::after {
          content: '';
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1000;
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s, visibility 0.2s;
        }

        .ql-toolbar button:hover::after {
          opacity: 1;
          visibility: visible;
        }

        .ql-bold:hover::after { content: 'Bold (Ctrl+B)'; }
        .ql-italic:hover::after { content: 'Italic (Ctrl+I)'; }
        .ql-underline:hover::after { content: 'Underline (Ctrl+U)'; }
        .ql-strike:hover::after { content: 'Strikethrough'; }
        .ql-link:hover::after { content: 'Insert Link'; }
        .ql-image:hover::after { content: 'Insert Image'; }
        .ql-video:hover::after { content: 'Insert Video'; }
        .ql-clean:hover::after { content: 'Clear Formatting'; }
        .ql-list[value="ordered"]:hover::after { content: 'Numbered List'; }
        .ql-list[value="bullet"]:hover::after { content: 'Bullet List'; }
        .ql-blockquote:hover::after { content: 'Blockquote'; }
        .ql-code-block:hover::after { content: 'Code Block'; }
        .ql-indent[value="-1"]:hover::after { content: 'Decrease Indent'; }
        .ql-indent[value="+1"]:hover::after { content: 'Increase Indent'; }
        .ql-header:hover::after { content: 'Header'; }
        .ql-font:hover::after { content: 'Font'; }
        .ql-size:hover::after { content: 'Font Size'; }
        .ql-color:hover::after { content: 'Text Color'; }
        .ql-background:hover::after { content: 'Background Color'; }
        .ql-align:hover::after { content: 'Text Alignment'; }
      `}
      </style>
    </>
  );
}
