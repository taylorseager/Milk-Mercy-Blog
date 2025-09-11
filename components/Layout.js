/* eslint-disable react/prop-types */
import Header from './Header';
import Footer from './Footer';
// TODO: Uncomment when ready to add Google AdSense
// import AdSense from './AdSense';

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      {/* TODO: Uncomment when ready to add Google AdSense sidebar
      <div className="content-wrapper">
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
        <main className="main-content">
          {children}
        </main>
      </div>
      */}
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
