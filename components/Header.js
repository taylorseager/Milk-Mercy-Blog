import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <Link href="/" className="logo">
          Milk & Mercy
        </Link>
        <nav className="nav">
          <Link href="/">
            Home
          </Link>
          <Link href="/about">
            About
          </Link>
          <Link href="/login">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
