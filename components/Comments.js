/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function Comments({ slug }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const loadComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?slug=${slug}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }, [slug]);

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }

    // Load comments
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          comment: newComment,
          username: user.username,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([data.comment, ...comments]);
        setNewComment('');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="comments-section">
      <h3>Comments ({comments.length})</h3>

      {/* Comment Form */}
      <div className="comment-form-container">
        {user ? (
          <form onSubmit={handleSubmit} className="comment-form">
            <div className="form-header">
              <span className="logged-in-as">Commenting as: <strong>{user.username}</strong></span>
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              rows="4"
              maxLength="1000"
              className="comment-textarea"
              disabled={isSubmitting}
            />
            <div className="form-actions">
              <span className="character-count">{newComment.length}/1000</span>
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="submit-comment"
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="login-prompt">
            <p>You must be logged in to leave a comment.</p>
            <Link href="/login" className="login-link">Login or Register</Link>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <span className="comment-author">{comment.username}</span>
                <time className="comment-date">{formatDate(comment.createdAt)}</time>
              </div>
              <div className="comment-content">{comment.comment}</div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .comments-section {
          margin-top: 60px;
          padding-top: 40px;
          border-top: 2px solid #e1e4e8;
        }

        h3 {
          color: var(--primary-color);
          margin-bottom: 30px;
          font-size: 1.5rem;
        }

        .comment-form-container {
          margin-bottom: 40px;
        }

        .comment-form {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e1e4e8;
        }

        .form-header {
          margin-bottom: 15px;
        }

        .logged-in-as {
          color: var(--text-light);
          font-size: 14px;
        }

        .comment-textarea {
          width: 100%;
          padding: 12px 16px;
          font-size: 16px;
          font-family: inherit;
          border: 2px solid #e1e4e8;
          border-radius: 4px;
          resize: vertical;
          min-height: 100px;
        }

        .comment-textarea:focus {
          outline: none;
          border-color: var(--link-color);
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
        }

        .character-count {
          font-size: 12px;
          color: var(--text-light);
        }

        .submit-comment {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-comment:hover:not(:disabled) {
          opacity: 0.9;
        }

        .submit-comment:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-prompt {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 8px;
          border: 1px solid #e1e4e8;
          text-align: center;
        }

        .login-prompt p {
          margin-bottom: 15px;
          color: var(--text-light);
        }

        .login-link {
          background-color: var(--link-color);
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          display: inline-block;
          transition: background-color 0.2s;
        }

        .login-link:hover {
          opacity: 0.9;
        }

        .comments-list {
          space-y: 20px;
        }

        .no-comments {
          text-align: center;
          color: var(--text-light);
          font-style: italic;
          padding: 40px 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .comment {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e1e4e8;
          margin-bottom: 20px;
          transition: box-shadow 0.2s;
        }

        .comment:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e1e4e8;
        }

        .comment-author {
          font-weight: 600;
          color: var(--primary-color);
        }

        .comment-date {
          font-size: 12px;
          color: var(--text-light);
        }

        .comment-content {
          line-height: 1.6;
          color: var(--text-dark);
          white-space: pre-wrap;
        }

        @media (max-width: 768px) {
          .form-actions {
            flex-direction: column;
            gap: 10px;
            align-items: stretch;
          }

          .submit-comment {
            width: 100%;
          }

          .comment-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }
        }
      `}
      </style>
    </div>
  );
}
