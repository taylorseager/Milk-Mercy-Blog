/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AdminContact() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('adminAuth');
      if (isAuth !== 'true') {
        window.location.href = '/admin';
        return;
      }
      setIsAuthenticated(true);
    }
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contact');
      const data = await response.json();
      if (response.ok) {
        setSubmissions(data.submissions || []);
      } else {
        setError(data.error || 'Failed to load submissions');
      }
    } catch (err) {
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const markAsRead = async (id, read) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read }),
      });

      if (response.ok) {
        setSubmissions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, read } : sub)));
      }
    } catch (err) {
      console.error('Failed to update submission:', err);
    }
  };

  const markAsReplied = async (id, replied) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, replied }),
      });

      if (response.ok) {
        setSubmissions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, replied } : sub)));
      }
    } catch (err) {
      console.error('Failed to update submission:', err);
    }
  };

  const deleteSubmission = async (id) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete submission:', err);
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Contact Submissions - Admin</title>
      </Head>

      <div className="admin-container">
        <div className="admin-header">
          <h1>Contact Submissions</h1>
          <Link href="/admin" className="back-link">
            ← Back to Admin
          </Link>
        </div>

        {loading && <div className="loading">Loading submissions...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && (
          <div className="submissions-container">
            {submissions.length === 0 ? (
              <div className="no-submissions">
                <p>No contact submissions yet.</p>
              </div>
            ) : (
              <div className="submissions-stats">
                <p>
                  Total: {submissions.length} |
                  Unread: {submissions.filter((s) => !s.read).length} |
                  Replied: {submissions.filter((s) => s.replied).length} |
                  No Email: {submissions.filter((s) => s.allowEmailContact === false).length}
                </p>
              </div>
            )}

            <div className="submissions-list">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className={`submission-card ${submission.read ? 'read' : 'unread'} ${submission.replied ? 'replied' : ''}`}
                >
                  <div className="submission-header">
                    <div className="submission-meta">
                      <h3>{submission.name}</h3>
                      <span className="email">{submission.email}</span>
                      <span className="date">{formatDate(submission.createdAt)}</span>
                      <div className="contact-permission">
                        <span className="permission-label">Email Contact:</span>
                        <span className={`permission-status ${submission.allowEmailContact !== false ? 'allowed' : 'denied'}`}>
                          {submission.allowEmailContact !== false ? '✓ Allowed' : '✗ Not Permitted'}
                        </span>
                      </div>
                    </div>
                    <div className="submission-actions">
                      <button
                        type="button"
                        onClick={() => markAsRead(submission.id, !submission.read)}
                        className={`read-btn ${submission.read ? 'mark-unread' : 'mark-read'}`}
                      >
                        {submission.read ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSubmission(submission.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                      <label className="replied-checkbox">
                        <input
                          type="checkbox"
                          checked={submission.replied || false}
                          onChange={(e) => markAsReplied(submission.id, e.target.checked)}
                        />
                        <span className="checkmark" />
                        Replied
                      </label>
                    </div>
                  </div>
                  <div className="submission-content">
                    <p>{submission.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid var(--border-color);
        }

        .admin-header h1 {
          color: var(--primary-color);
          margin: 0;
        }

        .back-link {
          color: var(--link-color);
          text-decoration: none;
          font-weight: 500;
          padding: 8px 16px;
          border: 1px solid var(--link-color);
          border-radius: 4px;
          transition: all 0.2s;
        }

        .back-link:hover {
          background: var(--link-color);
          color: white;
          text-decoration: none;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: var(--text-light);
          font-size: 1.1rem;
        }

        .error-message {
          background: #fee;
          color: #d32f2f;
          padding: 16px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .no-submissions {
          text-align: center;
          padding: 60px 20px;
          background: var(--background-alt);
          border-radius: 8px;
          color: var(--text-light);
        }

        .submissions-stats {
          background: var(--background-alt);
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 14px;
          color: var(--text-color);
        }

        .submissions-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .submission-card {
          background: white;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          padding: 20px;
          transition: all 0.2s;
        }

        .submission-card.unread {
          border-left: 4px solid var(--link-color);
          background: #f8f9ff;
        }

        .submission-card.read {
          opacity: 0.8;
        }

        .submission-card.replied {
          border-left-color: #28a745;
          background: #f8fff9;
        }

        .submission-card.replied.unread {
          border-left-color: #28a745;
          background: #f0fff4;
        }

        .submission-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border-color);
        }

        .submission-meta h3 {
          color: var(--primary-color);
          margin: 0 0 5px 0;
          font-size: 1.2rem;
        }

        .submission-meta .email {
          color: var(--text-light);
          font-size: 14px;
          margin-right: 15px;
        }

        .submission-meta .date {
          color: var(--text-light);
          font-size: 12px;
        }

        .contact-permission {
          margin-top: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .permission-label {
          font-size: 12px;
          color: var(--text-light);
          font-weight: 500;
        }

        .permission-status {
          font-size: 12px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .permission-status.allowed {
          color: #28a745;
          background: #f0fff4;
        }

        .permission-status.denied {
          color: #dc3545;
          background: #fff5f5;
        }

        .submission-actions {
          display: flex;
          gap: 15px;
          flex-shrink: 0;
          align-items: center;
        }

        .read-btn, .delete-btn {
          padding: 6px 12px;
          font-size: 12px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .mark-read {
          background: var(--link-color);
          color: white;
        }

        .mark-read:hover {
          opacity: 0.9;
        }

        .mark-unread {
          background: var(--text-light);
          color: white;
        }

        .mark-unread:hover {
          background: var(--text-color);
        }

        .delete-btn {
          background: #dc3545;
          color: white;
        }

        .delete-btn:hover {
          background: #c82333;
        }

        .replied-checkbox {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 12px;
          color: var(--text-color);
          user-select: none;
          white-space: nowrap;
        }

        .replied-checkbox input[type="checkbox"] {
          margin-right: 6px;
          transform: scale(1.1);
          cursor: pointer;
        }

        .replied-checkbox input[type="checkbox"]:checked {
          accent-color: #28a745;
        }

        .submission-content {
          line-height: 1.6;
          color: var(--text-color);
        }

        .submission-content p {
          margin: 0;
          white-space: pre-wrap;
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .submission-header {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }

          .submission-actions {
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
          }

          .read-btn, .delete-btn {
            flex: 0 0 auto;
            min-width: 100px;
          }

          .replied-checkbox {
            flex: 0 0 auto;
            font-size: 11px;
          }
        }
      `}
      </style>
    </>
  );
}
