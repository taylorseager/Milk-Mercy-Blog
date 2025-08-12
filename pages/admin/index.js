/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const ADMIN_HASH = 'Avery2025';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('adminAuth');
      if (isAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple password check (in production, use proper authentication)
    if (password === ADMIN_HASH) {
      // Store authentication in sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('adminAuth', 'true');
      }
      setIsAuthenticated(true);
    } else {
      setError('Invalid password');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setPassword('');
  };

  if (isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin Dashboard - Milk & Mercy</title>
        </Head>

        <div className="admin-container">
          <div className="admin-dashboard">
            <div className="dashboard-header">
              <h1>Admin Dashboard</h1>
              <button type="button" onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>

            <div className="admin-actions">
              <div className="action-card-wrapper">
                <Link href="/admin/new-post" passHref>
                  <div>
                    <h3>Create New Post</h3>
                    <p>Write and publish a new blog post</p>
                  </div>
                </Link>
              </div>

              <div className="action-card-wrapper">
                <Link href="/admin/drafts" passHref>
                  <div>
                    <h3>Manage Drafts</h3>
                    <p>View and edit your saved drafts</p>
                  </div>
                </Link>
              </div>

              <div className="action-card-wrapper">
                <Link href="/admin/manage-posts" passHref>
                  <div>
                    <h3>Manage Posts</h3>
                    <p>View and delete published posts</p>
                  </div>
                </Link>
              </div>

              <div className="action-card-wrapper">
                <Link href="/admin/settings" passHref>
                  <div>
                    <h3>Site Settings</h3>
                    <p>Edit site name, homepage, and more</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .admin-container {
            min-height: 60vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px 20px;
          }

          .admin-dashboard {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
          }

          .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e1e4e8;
          }

          h1 {
            color: var(--primary-color);
            margin: 0;
          }

          .logout-button {
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

          .logout-button:hover {
            background-color: #c82333;
          }

          .admin-actions {
            display: grid;
            gap: 20px;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }

          .action-card-wrapper {
            background: white;
            border: 2px solid var(--primary-color);
            border-radius: 8px;
            padding: 30px 20px;
            text-align: center;
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            cursor: pointer;
          }

          .action-card-wrapper:hover {
            border-color: var(--link-color);
            background: #f8f9fa;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .action-card-wrapper a {
            text-decoration: none;
            color: inherit;
            display: block;
          }

          .action-card-wrapper div {
            width: 100%;
            height: 100%;
          }

          .action-card-wrapper h3 {
            color: var(--primary-color);
            margin: 0 0 10px 0;
            font-size: 1.2rem;
          }

          .action-card-wrapper p {
            color: var(--text-light);
            margin: 0;
            font-size: 14px;
          }

          @media (max-width: 768px) {
            .dashboard-header {
              flex-direction: column;
              gap: 20px;
              text-align: center;
            }

            .admin-actions {
              grid-template-columns: 1fr;
            }
          }
        `}
        </style>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Access - Milk & Mercy</title>
      </Head>

      <div className="login-container">
        <div className="login-box">
          <h1>Admin Access</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter access code"
              className="password-input"
              required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="login-button">
              Access Admin
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 60vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
        }

        .login-box {
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        h1 {
          color: var(--primary-color);
          margin-bottom: 30px;
          text-align: center;
        }

        .password-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 16px;
          border: 2px solid #e1e4e8;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .password-input:focus {
          outline: none;
          border-color: var(--link-color);
        }

        .error {
          color: #dc3545;
          margin: 10px 0;
          font-size: 14px;
        }

        .login-button {
          width: 100%;
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 12px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .login-button:hover {
          opacity: 0.9;
        }

        .hint {
          text-align: center;
          color: var(--text-light);
          font-size: 14px;
          margin-top: 20px;
        }
      `}
      </style>
    </>
  );
}
