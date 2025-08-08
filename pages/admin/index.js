/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple password check (in production, use proper authentication)
    if (password === 'admin123') {
      // Store authentication in sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('adminAuth', 'true');
      }
      router.push('/admin/new-post');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - Milk & Mercy</title>
      </Head>

      <div className="login-container">
        <div className="login-box">
          <h1>Admin Login</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="password-input"
              required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <p className="hint">Default password: admin123</p>
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
