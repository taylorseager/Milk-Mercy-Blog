/* eslint-disable react/prop-types */
import Link from 'next/link';

export default function BlogCard({ post }) {
  return (
    <article className="blog-card">
      <Link href={`/blog/${post.slug}`} passHref>
        <h2>{post.title}</h2>
      </Link>
      <div className="blog-meta">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>
      <p className="blog-excerpt">{post.excerpt}</p>
      <Link href={`/blog/${post.slug}`} className="read-more">
        Read more →
      </Link>
    </article>
  );
}
