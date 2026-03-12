import Link from 'next/link';
import { getAllPostsMeta } from '@/lib/posts';

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const metadata = {
  title: 'All Posts | Milk & Mercy',
};

export default function BlogIndexPage() {
  const posts = getAllPostsMeta();

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-10">All Posts</h1>

      {posts.length === 0 ? (
        <p className="text-stone-400">No posts yet. Check back soon.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-stone-100">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-5">
                <span className="font-serif text-lg text-stone-900 group-hover:text-stone-500 transition-colors">
                  {post.title}
                </span>
                <time className="shrink-0 text-xs text-stone-400 tracking-widest uppercase">
                  {formatDate(post.date)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
