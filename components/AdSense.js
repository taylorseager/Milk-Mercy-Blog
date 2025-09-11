/*
 * Google AdSense Component - Ready for Future Use
 *
 * This component is set up and ready to display Google AdSense ads.
 * To activate:
 * 1. Get Google AdSense approval for your domain
 * 2. Uncomment the AdSense components in Layout.js and Footer.js
 * 3. Uncomment the AdSense script in _app.js
 * 4. Uncomment the ad-related CSS in globals.css
 * 5. Replace placeholder client ID and slot IDs with real values
 */

/* eslint-disable react/prop-types */
import { useEffect } from 'react';

export default function AdSense({
  client,
  slot,
  style = {},
  className = '',
  format = 'auto',
  responsive = 'true',
}) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          ...style,
        }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
