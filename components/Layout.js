/* eslint-disable react/prop-types */
import Header from './Header';
import Footer from './Footer';
import AdSense from './AdSense';

export default function Layout({ children, showSidebar = true }) {
  return (
    <div className="layout">
      <Header />
      <div className="content-wrapper">
        {showSidebar && (
          <aside className="sidebar">
            <div className="sidebar-ad">
              <AdSense
                client="ca-pub-YOUR_ADSENSE_CLIENT_ID"
                slot="YOUR_AD_SLOT_ID"
                className="sidebar-adsense"
                format="vertical"
              />
            </div>
          </aside>
        )}
        <main className="main-content">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
