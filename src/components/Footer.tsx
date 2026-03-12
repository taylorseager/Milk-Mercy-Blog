export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-stone-200 bg-white mt-16">
      <div className="max-w-5xl mx-auto px-6 py-8 text-center">
        <p className="text-sm text-stone-400 tracking-wide">
          &copy; {year} Milk &amp; Mercy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
