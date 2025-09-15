import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [settings, setSettings] = useState({
    siteName: 'Milk & Mercy',
    logoImage: '',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings((prevSettings) => ({ ...prevSettings, ...data }));
        }
      } catch (error) {
        console.error('Error loading header settings:', error);
      }
    };

    loadSettings();
  }, []);

  return (
    <header className="header">
      <div className="container">
        {/* eslint-disable-next-line @next/next/link-passhref */}
        <Link href="/">
          <div className="logo">
            {settings.logoImage && (
              <Image
                src={settings.logoImage}
                alt={settings.siteName}
                width={65}
                height={60}
                style={{ maxWidth: '200px', height: 'auto' }}
                priority
              />
            )}
            <span className="site-title">Milk & Honey</span>
          </div>
        </Link>
        <nav className="nav">
          <Link href="/">
            Home
          </Link>
          <Link href="/about">
            About
          </Link>
          <Link href="/contact">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
