import BlogCard from '@/components/BlogCard';
import NewsletterSignup from '@/components/NewsletterSignup';
import { getRecentPosts } from '@/lib/posts';

export default function HomePage() {
  const recentPosts = getRecentPosts(4);

  return (
    <>
      {/* Welcome section */}
      <section className="bg-stone-50 border-b border-stone-100">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-tight mb-8">
            Welcome to Milk &amp; Mercy
          </h1>
          <div className="prose">
            <p>Hello, and welcome!</p>
            <p>
              I&apos;m so glad you found your way here. <em>Milk &amp; Mercy</em> is a little
              corner of the internet I&apos;m building as a place to share things about my journey into motherhood, and how God is shaping and forming me as I grow in my Christlikeness. Just a space to be real about all things life.
            </p>
            <h2>Why &ldquo;Milk &amp; Mercy&rdquo;?</h2>
            <p>
              <strong><u>Milk</u></strong>: nourishing, simple, honest. Specifically, in regards to 1 Peter 2:2.
            </p>
            <p>
              <strong><u>Mercy</u></strong>: undeserved, gentle, and always available — even on the hardest days.
            </p>
            <p>
              Together, they represent what I hope this space becomes for you (and for me): something that
              feeds your soul, and reminds you that grace is closer than you think.
            </p>
            {/* <h2>What to Expect</h2>
            <p>This blog is a space for:</p>
            <ul>
              <li><strong>Stories</strong> — small moments that carry big weight</li>
              <li><strong>Reflections</strong> — honest thoughts on faith, life, and the everyday</li>
              <li><strong>Rest</strong> — permission to exhale, to be still, to just <em>be</em></li>
            </ul> */}
            <p>I&apos;m so glad you&apos;re here. Pull up a chair and get cozy.</p>
          </div>
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

      <NewsletterSignup />
    </>
  );
}
