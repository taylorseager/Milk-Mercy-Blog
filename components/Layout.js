/* eslint-disable react/prop-types */
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
