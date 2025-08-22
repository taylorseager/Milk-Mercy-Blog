/* eslint-disable react/prop-types */
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import BlogCard from '../components/BlogCard';
import { getSortedPostsData } from '../lib/posts';

export default function Home({ allPostsData, settings }) {
  const displayPosts = allPostsData.slice(0, settings.maxPostsOnHomepage || 5);

  return (
    <>
      <Head>
        <title>{settings.siteName} - {settings.tagline || 'A Blog'}</title>
        <meta name="description" content={settings.tagline || settings.heroSubtitle} />
      </Head>

      <section className="hero">
        {settings.heroImage && (
          <div className="hero-image">
            <img src={settings.heroImage} alt="Hero" />
          </div>
        )}
        <div className="hero-content">
          <h1>{settings.heroTitle || 'Welcome'}</h1>
          <p className="subtitle">{settings.heroSubtitle || 'Explore our latest posts'}</p>
        </div>
      </section>

      {settings.showAboutSection && settings.aboutText && (
        <section className="about-section">
          <div className="about-content">
            <div className="about-text">
              <h2>About</h2>
              <p>{settings.aboutText}</p>
            </div>
            {settings.aboutImage && (
              <div className="about-image">
                <img src={settings.aboutImage} alt="About" />
              </div>
            )}
          </div>
        </section>
      )}

      <section className="posts-section">
        <h2>Recent Posts</h2>
        {displayPosts.length === 0 ? (
          <p className="no-posts">No posts yet. Check back soon!</p>
        ) : (
          <div className="posts-grid">
            {displayPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
        {allPostsData.length > displayPosts.length && (
          <div className="view-all">
            <a href="/blog" className="view-all-button">
              View All Posts ({allPostsData.length})
            </a>
          </div>
        )}
      </section>

      <style jsx>{`
        .hero {
          position: relative;
          text-align: center;
          padding: 60px 0;
          overflow: hidden;
        }

        .hero-image {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
        }

        .hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.3;
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .about-content {
          display: grid;
          grid-template-columns: ${settings.aboutImage ? '1fr 300px' : '1fr'};
          gap: 40px;
          align-items: center;
        }

        .about-image img {
          width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .view-all {
          text-align: center;
          margin-top: 40px;
        }

        .view-all-button {
          display: inline-block;
          padding: 12px 30px;
          background-color: var(--primary-color);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .view-all-button:hover {
          background-color: var(--link-color);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .about-content.has-image {
            grid-template-columns: 1fr;
          }

          .about-image {
            order: -1;
          }
        }
      `}
      </style>
    </>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  // Load settings
  const settingsFile = path.join(process.cwd(), 'data', 'settings.json');
  let settings = {
    siteName: 'Milk & Mercy',
    tagline: 'Welcome to our blog',
    heroTitle: 'Welcome to Milk & Mercy',
    heroSubtitle: 'Discover amazing stories and insights',
    aboutText: '',
    footerText: 'All rights reserved.',
    heroImage: '',
    aboutImage: '',
    logoImage: '',
    maxPostsOnHomepage: 5,
    showAboutSection: true,
  };
  try {
    if (fs.existsSync(settingsFile)) {
      settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return {
    props: {
      allPostsData,
      settings,
    },
  };
}
