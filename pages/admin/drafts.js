/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Drafts() {
  const router = useRouter();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDrafts = async () => {
    try {
      const response = await fetch('/api/drafts');
      if (response.ok) {
        const draftsData = await response.json();
        setDrafts(draftsData);
      }
    } catch (error) {
      console.error('Error loading drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('adminAuth');
      if (!isAuth) {
        router.push('/admin');
        return;
      }
    }

    loadDrafts();
  }, [router]);

  const deleteDraft = async (id) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to delete this draft?')) {
      return;
    }

    try {
      const response = await fetch(`/api/drafts?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDrafts(drafts.filter((draft) => draft.id !== id));
      } else {
        alert('Failed to delete draft');
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      alert('An error occurred while deleting the draft');
    }
  };

  const publishDraft = async (draft) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Are you sure you want to publish this draft?')) {
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: draft.title,
          content: draft.content,
          date: new Date().toISOString().split('T')[0],
          excerpt: draft.content.replace(/<[^>]*>/g, '').substring(0, 150),
          draftId: draft.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Remove from drafts list
        setDrafts(drafts.filter((d) => d.id !== draft.id));
        // Redirect to published post
        router.push(`/blog/${data.slug}`);
      } else {
        alert('Failed to publish draft');
      }
    } catch (error) {
      console.error('Error publishing draft:', error);
      alert('An error occurred while publishing the draft');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="loading">Loading drafts...</div>;
  }

  return (
    <>
      <Head>
        <title>Drafts - Milk & Mercy Admin</title>
      </Head>

      <div className="drafts-container">
        <div className="header">
          <div className="header-left">
            <h1>Draft Posts</h1>
            <Link href="/admin" className="back-button">
              ← Back to Dashboard
            </Link>
          </div>
          <Link href="/admin/new-post" passHref>
            <button type="button" className="new-post-button">
              Create New Post
            </button>
          </Link>
        </div>

        {drafts.length === 0 ? (
          <div className="no-drafts">
            <p>No drafts found.</p>
            <Link href="/admin/new-post" passHref>
              <button type="button" className="create-first-button">
                Create Your First Draft
              </button>
            </Link>
          </div>
        ) : (
          <div className="drafts-list">
            {drafts.map((draft) => (
              <div key={draft.id} className="draft-card">
                <div className="draft-info">
                  <h3 className="draft-title">{draft.title}</h3>
                  <p className="draft-date">
                    Last saved: {formatDate(draft.lastModified)}
                  </p>
                </div>
                <div className="draft-actions">
                  <button
                    type="button"
                    onClick={() => router.push(`/admin/new-post?draft=${draft.id}`)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => publishDraft(draft)}
                    className="publish-button"
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteDraft(draft.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .drafts-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 10px;
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
          width: fit-content;
        }

        .back-button:hover {
          background: var(--link-color);
          color: white;
        }

        .new-post-button {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .new-post-button:hover {
          opacity: 0.9;
        }

        .loading {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-light);
          font-size: 18px;
        }

        .no-drafts {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .no-drafts p {
          color: var(--text-light);
          font-size: 18px;
          margin-bottom: 30px;
        }

        .create-first-button {
          background-color: var(--link-color);
          color: white;
          border: none;
          padding: 12px 30px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .create-first-button:hover {
          opacity: 0.9;
        }

        .drafts-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .draft-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.2s;
        }

        .draft-card:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .draft-info {
          flex: 1;
        }

        .draft-title {
          margin: 0 0 8px 0;
          color: var(--primary-color);
          font-size: 1.3rem;
        }

        .draft-date {
          margin: 0;
          color: var(--text-light);
          font-size: 14px;
        }

        .draft-actions {
          display: flex;
          gap: 10px;
        }

        .edit-button {
          background-color: var(--link-color);
          color: white;
          border: none;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .edit-button:hover {
          opacity: 0.9;
        }

        .publish-button {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .publish-button:hover {
          background-color: #218838;
        }

        .delete-button {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .delete-button:hover {
          background-color: #c82333;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 20px;
            align-items: stretch;
          }

          .header-left {
            align-items: center;
            text-align: center;
          }

          .back-button {
            align-self: center;
          }

          .draft-card {
            flex-direction: column;
            align-items: stretch;
            gap: 20px;
          }

          .draft-actions {
            justify-content: space-between;
          }

          .edit-button,
          .publish-button,
          .delete-button {
            flex: 1;
          }
        }
      `}
      </style>
    </>
  );
}
