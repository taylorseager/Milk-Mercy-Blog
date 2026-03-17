import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b border-stone-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Milk & Honey"
            width={60}
            height={36}
            priority
          />
          <span className="ml-3 font-serif text-xl text-stone-900 tracking-wide">
            Milk &amp; Honey
          </span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            href="/"
            className="text-sm tracking-wide text-stone-600 hover:text-stone-900 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="text-sm tracking-wide text-stone-600 hover:text-stone-900 transition-colors"
          >
            Posts
          </Link>
          <Link
            href="/contact"
            className="text-sm tracking-wide text-stone-600 hover:text-stone-900 transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
