import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdSense from './AdSense';

export default function Footer() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [siteName, setSiteName] = useState('Milk & Mercy');
  const [footerText, setFooterText] = useState('All rights reserved.');

  const loadFooterSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const settings = await response.json();
        if (settings.siteName) {
          setSiteName(settings.siteName);
        }
        if (settings.footerText) {
          setFooterText(settings.footerText);
        }
      }
    } catch (error) {
      console.error('Error loading footer settings:', error);
    }
  };

  useEffect(() => {
    // Check if admin is logged in
    if (typeof window !== 'undefined') {
      const adminAuth = sessionStorage.getItem('adminAuth');
      setIsAdmin(adminAuth === 'true');
    }

    // Load footer settings
    loadFooterSettings();
  }, []);

  return (
    <>
      {/* Bottom Ad Placement 1 - Before Footer */}
      <div className="bottom-ad-container">
        <AdSense
          client="ca-pub-YOUR_ADSENSE_CLIENT_ID"
          slot="YOUR_BOTTOM_AD_SLOT_1"
          className="bottom-ad-1"
          format="horizontal"
        />
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} {siteName}. {footerText}</p>
            {isAdmin && (
              <Link href="/admin" className="admin-link">
                Admin
              </Link>
            )}
          </div>
        </div>

        {/* Bottom Ad Placement 2 - In Footer */}
        <div className="footer-ad-container">
          <AdSense
            client="ca-pub-YOUR_ADSENSE_CLIENT_ID"
            slot="YOUR_BOTTOM_AD_SLOT_2"
            className="bottom-ad-2"
            format="horizontal"
          />
        </div>
      </footer>

      <style jsx>{`
        .bottom-ad-container {
          max-width: 1200px;
          margin: 40px auto 20px;
          padding: 0 20px;
          text-align: center;
        }

        .footer-ad-container {
          max-width: 1200px;
          margin: 20px auto 0;
          padding: 0 20px;
          text-align: center;
        }

        .footer {
          background: var(--primary-color);
          color: white;
          padding: 30px 0;
          margin-top: auto;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-content p {
          margin: 0;
        }

        .admin-link {
          color: white;
          text-decoration: none;
          font-size: 14px;
          padding: 8px 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          transition: all 0.2s;
        }

        .admin-link:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
        }
      `}
      </style>
    </>
  );
}
