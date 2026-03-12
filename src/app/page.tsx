import BlogCard from '@/components/BlogCard';
import { getRecentPosts } from '@/lib/posts';

export default function HomePage() {
  const recentPosts = getRecentPosts(4);

  return (
    <>
      {/* Welcome section */}
      <section className="bg-stone-50 border-b border-stone-100">
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-tight mb-5">
            Welcome to Milk &amp; Mercy
          </h1>
          <p className="text-stone-500 text-lg leading-relaxed">
            A place to slow down, reflect, and find grace woven through
            the fabric of everyday life.
          </p>
        </div>
      </section>

      {/* Recent posts */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="font-serif text-2xl text-stone-900 mb-8">
          Recent Posts
        </h2>

        {recentPosts.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-lg border border-dashed border-stone-200 bg-stone-50"
                aria-hidden="true"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recentPosts.map((post) => (
              <BlogCard key={post.slug} {...post} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
