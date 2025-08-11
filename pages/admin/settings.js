/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SiteSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    siteName: '',
    tagline: '',
    heroTitle: '',
    heroSubtitle: '',
    aboutText: '',
    footerText: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
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

    // Load current settings
    loadSettings();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Head>
        <title>Site Settings - Milk & Mercy Admin</title>
      </Head>

      <div className="settings-container">
        <div className="settings-header">
          <h1>Site Settings</h1>
          <Link href="/admin" className="back-button">
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label htmlFor="siteName">Site Name</label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                placeholder="Your site name"
                required
              />
              <small>This appears in the header and browser tab</small>
            </div>

            <div className="form-group">
              <label htmlFor="tagline">Tagline</label>
              <input
                type="text"
                id="tagline"
                name="tagline"
                value={settings.tagline}
                onChange={handleChange}
                placeholder="A short description of your site"
              />
              <small>A brief description of your site</small>
            </div>
          </div>

          <div className="form-section">
            <h2>Home Page</h2>
            <div className="form-group">
              <label htmlFor="heroTitle">Hero Title</label>
              <input
                type="text"
                id="heroTitle"
                name="heroTitle"
                value={settings.heroTitle}
                onChange={handleChange}
                placeholder="Welcome message"
              />
              <small>The main heading on your home page</small>
            </div>

            <div className="form-group">
              <label htmlFor="heroSubtitle">Hero Subtitle</label>
              <textarea
                id="heroSubtitle"
                name="heroSubtitle"
                value={settings.heroSubtitle}
                onChange={handleChange}
                placeholder="Subtitle text"
                rows="2"
              />
              <small>Supporting text under the main heading</small>
            </div>

            <div className="form-group">
              <label htmlFor="aboutText">About Section</label>
              <textarea
                id="aboutText"
                name="aboutText"
                value={settings.aboutText}
                onChange={handleChange}
                placeholder="About your blog..."
                rows="4"
              />
              <small>A paragraph about your blog (appears on home page)</small>
            </div>
          </div>

          <div className="form-section">
            <h2>Footer</h2>
            <div className="form-group">
              <label htmlFor="footerText">Footer Text</label>
              <input
                type="text"
                id="footerText"
                name="footerText"
                value={settings.footerText}
                onChange={handleChange}
                placeholder="Copyright text"
              />
              <small>Additional text for the footer (year is added automatically)</small>
            </div>
          </div>

          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" disabled={isSaving} className="save-button">
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .settings-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .settings-header {
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

        .settings-form {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 0;
          overflow: hidden;
        }

        .form-section {
          padding: 30px;
          border-bottom: 1px solid #e1e4e8;
        }

        .form-section:last-of-type {
          border-bottom: none;
        }

        .form-section h2 {
          color: var(--primary-color);
          font-size: 1.3rem;
          margin: 0 0 25px 0;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--primary-color);
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 12px 16px;
          font-size: 16px;
          font-family: inherit;
          border: 2px solid #e1e4e8;
          border-radius: 4px;
          transition: border-color 0.2s;
        }

        input[type="text"]:focus,
        textarea:focus {
          outline: none;
          border-color: var(--link-color);
        }

        textarea {
          resize: vertical;
          min-height: 60px;
        }

        small {
          display: block;
          margin-top: 5px;
          color: var(--text-light);
          font-size: 13px;
        }

        .message {
          margin: 20px 30px;
          padding: 12px 16px;
          border-radius: 4px;
          font-size: 14px;
        }

        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .form-actions {
          padding: 30px;
          background: #f8f9fa;
          display: flex;
          justify-content: flex-end;
        }

        .save-button {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 12px 30px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .save-button:hover:not(:disabled) {
          opacity: 0.9;
        }

        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .settings-header {
            flex-direction: column;
            gap: 20px;
            align-items: stretch;
          }

          .back-button {
            text-align: center;
          }

          .form-section {
            padding: 20px;
          }

          .form-actions {
            padding: 20px;
          }
        }
      `}
      </style>
    </>
  );
}
