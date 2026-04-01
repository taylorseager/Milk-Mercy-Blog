import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostBySlug, getAllSlugs } from '@/lib/posts';
import AdSenseUnit from '@/components/AdSenseUnit';

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    return { title: `${post.title} | Milk & Honey` };
  } catch {
    return { title: 'Post Not Found | Milk & Honey' };
  }
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  const leftAdSlot = process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT_LEFT ?? '';
  const rightAdSlot = process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT_RIGHT ?? '';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex gap-8 items-start">
        {/* Left ad sidebar */}
        <aside className="hidden lg:block w-40 shrink-0 sticky top-8">
          <AdSenseUnit adSlot={leftAdSlot} className="min-h-[600px] w-full" />
        </aside>

        {/* Post content */}
        <article className="flex-1 min-w-0 max-w-2xl mx-auto">
          <header className="mb-10">
            <time className="text-xs text-stone-400 tracking-widest uppercase">
              {formatDate(post.date)}
            </time>
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 leading-tight mt-2">
              {post.title}
            </h1>
          </header>

          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>

        {/* Right ad sidebar */}
        <aside className="hidden lg:block w-40 shrink-0 sticky top-8">
          <AdSenseUnit adSlot={rightAdSlot} className="min-h-[600px] w-full" />
        </aside>
      </div>
    </div>
  );
}
