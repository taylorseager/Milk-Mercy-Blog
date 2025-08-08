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

  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('adminAuth');
      if (!isAuth) {
        router.push('/admin');
      }
    }
  }, [router]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      [{ indent: '-1' }, { indent: '+1' }],
      ['clean'],
    ],
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

  const handleSubmit = async (e) => {
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

        <form onSubmit={handleSubmit} className="post-form">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
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
          position: relative;
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

        .submit-button {
          position: absolute;
          bottom: 30px;
          right: 30px;
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

        .submit-button:hover:not(:disabled) {
          background-color: #c82333;
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .submit-button {
            position: static;
            width: 100%;
            margin-top: 20px;
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
      `}
      </style>
    </>
  );
}
