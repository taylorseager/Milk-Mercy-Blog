/* eslint-disable react/prop-types */
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import BlogCard from '../components/BlogCard';
import { getSortedPostsData } from '../lib/posts';

export default function Home({ allPostsData, settings }) {
  return (
    <>
      <Head>
        <title>{settings.siteName} - {settings.tagline || 'A Blog'}</title>
        <meta name="description" content={settings.tagline || settings.heroSubtitle} />
      </Head>

      <section className="hero">
        <h1>{settings.heroTitle || 'Welcome'}</h1>
        <p className="subtitle">{settings.heroSubtitle || 'Explore our latest posts'}</p>
      </section>

      {settings.aboutText && (
        <section className="about-section">
          <div className="about-content">
            <h2>About</h2>
            <p>{settings.aboutText}</p>
          </div>
        </section>
      )}

      <section className="posts-section">
        <h2>Recent Posts</h2>
        {allPostsData.length === 0 ? (
          <p className="no-posts">No posts yet. Check back soon!</p>
        ) : (
          <div className="posts-grid">
            {allPostsData.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
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
