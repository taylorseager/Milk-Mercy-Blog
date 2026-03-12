import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogCard({ slug, title, date, excerpt }: PostMeta) {
  return (
    <Link href={`/blog/${slug}`} className="group block">
      <article className="h-full border border-stone-200 rounded-lg p-6 bg-white hover:border-stone-400 transition-colors duration-200">
        <time className="text-xs text-stone-400 tracking-widest uppercase">
          {formatDate(date)}
        </time>
        <h2 className="mt-2 text-xl font-serif text-stone-900 group-hover:text-stone-600 transition-colors leading-snug">
          {title}
        </h2>
        <p className="mt-3 text-sm text-stone-500 leading-relaxed line-clamp-3">
          {excerpt}
        </p>
        <span className="mt-4 inline-block text-xs text-stone-400 group-hover:text-stone-700 transition-colors tracking-wide">
          Read more &rarr;
        </span>
      </article>
    </Link>
  );
}
