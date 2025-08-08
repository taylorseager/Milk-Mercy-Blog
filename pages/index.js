/* eslint-disable react/prop-types */
import Head from 'next/head';
import BlogCard from '../components/BlogCard';
import { getSortedPostsData } from '../lib/posts';

export default function Home({ allPostsData }) {
  return (
    <>
      <Head>
        <title>Milk & Mercy - A Blog</title>
        <meta name="description" content="Thoughts, stories, and reflections" />
      </Head>

      <section className="hero">
        <h1>Welcome to Milk & Mercy</h1>
        <p className="subtitle">Thoughts, stories, and reflections on life, faith, and everything in between.</p>
      </section>

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
  return {
    props: {
      allPostsData,
    },
  };
}
