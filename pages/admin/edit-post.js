/* eslint-disable react/no-danger */
import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function EditPost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalSlug, setOriginalSlug] = useState('');

  const loadPost = useCallback(async (slug) => {
    try {
      const response = await fetch(`/api/posts/${slug}`);
      if (response.ok) {
        const post = await response.json();
        setTitle(post.title);
        setContent(post.contentHtml);
        setExcerpt(post.excerpt);
        setDate(post.date);
        setOriginalSlug(slug);
      } else {
        alert('Post not found');
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error loading post:', error);
      alert('Error loading post');
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('adminAuth');
      if (!isAuth) {
        router.push('/admin');
        return;
      }
    }

    // Load post data if slug is provided
    const { slug } = router.query;
    if (slug) {
      loadPost(slug);
    }
  }, [router, loadPost]);

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
        [{ indent: '-1' }, { indent: '+1' }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean'],
      ],
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Please enter both title and content');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/posts/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalSlug,
          title,
          content,
          date,
          excerpt: excerpt || content.replace(/<[^>]*>/g, '').substring(0, 150),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/blog/${data.slug}`);
      } else {
        const error = await response.json();
        alert(`Failed to update post: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('An error occurred while updating the post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Post - Milk & Mercy Admin</title>
      </Head>

      <div className="admin-container">
        <div className="header">
          <h1>Edit Blog Post</h1>
          <Link href={`/blog/${originalSlug}`} className="back-button">
            ← Back to Post
          </Link>
        </div>

        <form onSubmit={handleUpdate} className="post-form">
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
            <label htmlFor="date">Publication Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="date-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Excerpt (Optional)</label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description of your post..."
              className="excerpt-input"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              theme="snow"
              placeholder="Start writing your blog post..."
            />
          </div>

          <div className="button-container">
            <button
              type="submit"
              disabled={isSubmitting}
              className="update-button"
            >
              {isSubmitting ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        h1 {
          color: var(--primary-color);
          margin: 0;
        }

        .back-button {
          color: var(--link-color);
          text-decoration: none;
          font-size: 14px;
          padding: 8px 16px;
          border: 1px solid var(--link-color);
          border-radius: 4px;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: var(--link-color);
          color: white;
        }

        .loading-container {
          min-height: 50vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .loading {
          font-size: 18px;
          color: var(--text-light);
        }

        .post-form {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 40px;
        }

        .form-group {
          margin-bottom: 30px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: var(--primary-color);
        }

        .title-input,
        .date-input,
        .excerpt-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 16px;
          border: 2px solid #e1e4e8;
          border-radius: 4px;
          transition: border-color 0.2s;
        }

        .title-input {
          font-size: 18px;
        }

        .title-input:focus,
        .date-input:focus,
        .excerpt-input:focus {
          outline: none;
          border-color: var(--link-color);
        }

        .excerpt-input {
          resize: vertical;
          font-family: inherit;
        }

        .button-container {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 30px;
        }

        .update-button {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 15px 25px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
          transition: all 0.2s;
          z-index: 1000;
        }

        .update-button:hover:not(:disabled) {
          background-color: #c82333;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
        }

        .update-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 15px;
            align-items: center;
            text-align: center;
          }

          .update-button {
            position: relative;
            bottom: auto;
            right: auto;
            width: 100%;
            border-radius: 8px;
          }

          .button-container {
            justify-content: stretch;
          }
        }
      `}
      </style>

      <style jsx global>{`
        .ql-editor {
          min-height: 300px;
          font-size: 16px;
          line-height: 1.6;
        }

        .ql-toolbar {
          border-top: 2px solid #e1e4e8;
          border-left: 2px solid #e1e4e8;
          border-right: 2px solid #e1e4e8;
          border-bottom: 1px solid #e1e4e8;
        }

        .ql-container {
          border-left: 2px solid #e1e4e8;
          border-right: 2px solid #e1e4e8;
          border-bottom: 2px solid #e1e4e8;
        }

        .ql-toolbar .ql-formats {
          margin-right: 10px;
        }

        .ql-toolbar button:hover::after {
          content: attr(title);
          position: absolute;
          bottom: -25px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1000;
          pointer-events: none;
        }

        .ql-bold:hover::after { content: 'Bold'; }
        .ql-italic:hover::after { content: 'Italic'; }
        .ql-underline:hover::after { content: 'Underline'; }
        .ql-strike:hover::after { content: 'Strikethrough'; }
        .ql-color:hover::after { content: 'Text Color'; }
        .ql-background:hover::after { content: 'Background Color'; }
        .ql-list[value="ordered"]:hover::after { content: 'Numbered List'; }
        .ql-list[value="bullet"]:hover::after { content: 'Bullet List'; }
        .ql-align:hover::after { content: 'Text Alignment'; }
        .ql-link:hover::after { content: 'Insert Link'; }
        .ql-image:hover::after { content: 'Insert Image'; }
        .ql-video:hover::after { content: 'Insert Video'; }
        .ql-blockquote:hover::after { content: 'Blockquote'; }
        .ql-code-block:hover::after { content: 'Code Block'; }
        .ql-indent[value="-1"]:hover::after { content: 'Decrease Indent'; }
        .ql-indent[value="+1"]:hover::after { content: 'Increase Indent'; }
        .ql-header:hover::after { content: 'Header'; }
        .ql-font:hover::after { content: 'Font'; }
        .ql-size:hover::after { content: 'Font Size'; }
        .ql-clean:hover::after { content: 'Remove Formatting'; }
      `}
      </style>
    </>
  );
}
