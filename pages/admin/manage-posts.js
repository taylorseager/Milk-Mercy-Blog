/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ManagePosts() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [archivedPosts, setArchivedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  const loadPosts = async () => {
    try {
      // Load active posts
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }

      // Load archived posts
      const archivedResponse = await fetch('/api/posts?archived=true');
      if (archivedResponse.ok) {
        const archivedData = await archivedResponse.json();
        setArchivedPosts(archivedData.posts || []);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
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

    loadPosts();
  }, [router]);

  const archivePost = async (slug, title, isArchived = false) => {
    const action = isArchived ? 'unarchive' : 'archive';
    const confirmMsg = isArchived
      ? `Restore "${title}" to published posts?`
      : `Archive "${title}"? It will be removed from the public site.`;
    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, action }),
      });

      if (response.ok) {
        await loadPosts(); // Reload both lists
        alert(isArchived ? 'Post restored successfully!' : 'Post archived successfully!');
      } else {
        alert(`Failed to ${action} post`);
      }
    } catch (error) {
      console.error(`Error ${action}ing post:`, error);
      alert(`An error occurred while ${action}ing the post`);
    }
  };

  const deletePost = async (slug, title, isArchived = false) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/posts?slug=${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (isArchived) {
          setArchivedPosts(archivedPosts.filter((post) => post.slug !== slug));
        } else {
          setPosts(posts.filter((post) => post.slug !== slug));
        }
        alert('Post deleted successfully!');
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('An error occurred while deleting the post');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <>
      <Head>
        <title>Manage Posts - Milk & Mercy Admin</title>
      </Head>

      <div className="posts-container">
        <div className="posts-header">
          <h1>Manage Posts</h1>
          <Link href="/admin" className="back-button">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="tabs">
          <button
            type="button"
            className={`tab ${!showArchived ? 'active' : ''}`}
            onClick={() => setShowArchived(false)}
          >
            Published ({posts.length})
          </button>
          <button
            type="button"
            className={`tab ${showArchived ? 'active' : ''}`}
            onClick={() => setShowArchived(true)}
          >
            Archived ({archivedPosts.length})
          </button>
        </div>

        {(() => {
          if (!showArchived && posts.length === 0) {
            return (
              <div className="no-posts">
                <p>No published posts found.</p>
                <Link href="/admin/new-post" className="create-post-button">
                  Create Your First Post
                </Link>
              </div>
            );
          }

          if (showArchived && archivedPosts.length === 0) {
            return (
              <div className="no-posts">
                <p>No archived posts found.</p>
              </div>
            );
          }

          return (
            <div className="posts-list">
              {(showArchived ? archivedPosts : posts).map((post) => (
                <div key={post.slug} className="post-card">
                  <div className="post-info">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-date">
                      {showArchived ? 'Archived' : 'Published'}: {formatDate(post.date)}
                    </p>
                    {post.excerpt && (
                      <p className="post-excerpt">{post.excerpt}</p>
                    )}
                  </div>
                  <div className="post-actions">
                    <Link href={`/blog/${post.slug}`} passHref>
                      <a href={`/blog/${post.slug}`} className="view-button" target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Link>
                    <button
                      type="button"
                      onClick={() => archivePost(post.slug, post.title, showArchived)}
                      className={showArchived ? 'restore-button' : 'archive-button'}
                    >
                      {showArchived ? 'Restore' : 'Archive'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePost(post.slug, post.title, showArchived)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      <style jsx>{`
        .posts-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .posts-header {
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

        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 2px solid #e1e4e8;
        }

        .tab {
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          color: var(--text-light);
          font-size: 16px;
          font-weight: 600;
          padding: 12px 20px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: -2px;
        }

        .tab:hover {
          color: var(--primary-color);
        }

        .tab.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
        }

        .loading {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-light);
          font-size: 18px;
        }

        .no-posts {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .no-posts p {
          color: var(--text-light);
          font-size: 18px;
          margin-bottom: 30px;
        }

        .create-post-button {
          background-color: var(--primary-color);
          color: white;
          text-decoration: none;
          padding: 12px 30px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 4px;
          display: inline-block;
          transition: opacity 0.2s;
        }

        .create-post-button:hover {
          opacity: 0.9;
        }

        .posts-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .post-card {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 25px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.2s;
        }

        .post-card:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .post-info {
          flex: 1;
          margin-right: 20px;
        }

        .post-title {
          margin: 0 0 8px 0;
          color: var(--primary-color);
          font-size: 1.3rem;
          line-height: 1.4;
        }

        .post-date {
          margin: 0 0 12px 0;
          color: var(--text-light);
          font-size: 14px;
        }

        .post-excerpt {
          margin: 0;
          color: var(--text-dark);
          font-size: 14px;
          line-height: 1.5;
          max-width: 500px;
        }

        .post-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .view-button {
          background-color: var(--link-color);
          color: white;
          text-decoration: none;
          border: none;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .view-button:hover {
          opacity: 0.9;
        }

        .archive-button {
          background-color: #ffc107;
          color: #000;
          border: none;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .archive-button:hover {
          background-color: #ffb300;
        }

        .restore-button {
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

        .restore-button:hover {
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
          .posts-header {
            flex-direction: column;
            gap: 20px;
            align-items: stretch;
          }

          .back-button {
            text-align: center;
          }

          .post-card {
            flex-direction: column;
            gap: 20px;
          }

          .post-info {
            margin-right: 0;
          }

          .post-actions {
            justify-content: space-between;
          }

          .view-button,
          .delete-button {
            flex: 1;
          }
        }
      `}
      </style>
    </>
  );
}
