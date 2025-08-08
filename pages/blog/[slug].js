/* eslint-disable react/prop-types */
/* eslint-disable react/no-danger */
import Head from 'next/head';
import { getAllPostSlugs, getPostData } from '../../lib/posts';

export default function Post({ postData }) {
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
        </header>

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />
      </article>
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
