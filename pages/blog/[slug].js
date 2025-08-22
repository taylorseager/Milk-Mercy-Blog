/* eslint-disable react/prop-types */
/* eslint-disable react/no-danger */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getAllPostSlugs, getPostData } from '../../lib/posts';
import 'react-quill/dist/quill.snow.css';
// import Comments from '../../components/Comments';

export default function Post({ postData }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    if (typeof window !== 'undefined') {
      const adminAuth = sessionStorage.getItem('adminAuth');
      setIsAdmin(adminAuth === 'true');
    }
  }, []);

  return (
    <>
      <Head>
        <title>{postData.title} - Milk & Mercy</title>
        <meta name="description" content={postData.excerpt || postData.title} />
      </Head>

      <article className="blog-post">
        <header className="post-header">
          <h1>{postData.title}</h1>
          <time dateTime={postData.date} className="post-date">
            {new Date(postData.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {isAdmin && (
            <Link href={`/admin/edit-post?slug=${postData.slug}`} className="edit-button">
              ✏️ Edit Post
            </Link>
          )}
        </header>

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />

        {/* <Comments slug={postData.slug} /> */}
      </article>

      <style jsx>{`
        .blog-post {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .post-header {
          margin-bottom: 40px;
          text-align: center;
          padding-bottom: 30px;
          border-bottom: 2px solid #e1e4e8;
        }

        .post-header h1 {
          color: var(--primary-color);
          font-size: 2.5rem;
          margin-bottom: 15px;
          line-height: 1.2;
        }

        .post-date {
          color: var(--text-light);
          font-size: 1rem;
          font-weight: 500;
        }

        .edit-button {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background-color: var(--link-color);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
          border: 2px solid var(--link-color);
        }

        .edit-button:hover {
          background-color: transparent;
          color: var(--link-color);
        }

        .post-content {
          line-height: 1.8;
          color: var(--text-dark);
          font-size: 1.1rem;
        }

        .post-content h1,
        .post-content h2,
        .post-content h3,
        .post-content h4,
        .post-content h5,
        .post-content h6 {
          color: var(--primary-color);
          margin-top: 2em;
          margin-bottom: 1em;
        }

        .post-content p {
          margin-bottom: 1.5em;
        }

        .post-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 2em 0;
        }

        .post-content blockquote {
          border-left: 4px solid var(--link-color);
          padding-left: 20px;
          margin: 2em 0;
          font-style: italic;
          color: var(--text-light);
        }

        .post-content code {
          background: #f1f3f4;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.9em;
        }

        .post-content pre {
          background: #f8f9fa;
          border: 1px solid #e1e4e8;
          border-radius: 8px;
          padding: 20px;
          overflow-x: auto;
          margin: 2em 0;
        }

        .post-content pre code {
          background: none;
          padding: 0;
        }

        .post-content ul,
        .post-content ol {
          margin: 1.5em 0;
          padding-left: 2em;
        }

        .post-content li {
          margin-bottom: 0.5em;
          line-height: 1.6;
          display: list-item;
          visibility: visible;
          opacity: 1;
        }

        .post-content ul ul,
        .post-content ol ol,
        .post-content ul ol,
        .post-content ol ul {
          margin: 0.5em 0;
        }


        @media (max-width: 768px) {
          .post-header h1 {
            font-size: 2rem;
          }

          .post-content {
            font-size: 1rem;
          }

        }
      `}
      </style>
    </>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);
  return {
    props: {
      postData,
    },
  };
}
