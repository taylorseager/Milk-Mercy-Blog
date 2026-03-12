'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSenseUnitProps {
  adSlot: string;
  className?: string;
}

export default function AdSenseUnit({ adSlot, className = '' }: AdSenseUnitProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    if (publisherId) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // already initialized
      }
    }
  }, [publisherId]);

  if (!publisherId) {
    // Visible placeholder only in development; invisible in production
    return (
      <div
        className={`rounded bg-stone-50 border border-dashed border-stone-200 flex items-center justify-center min-h-[250px] ${className}`}
        aria-hidden="true"
      >
        <span className="text-xs text-stone-300 select-none">Ad</span>
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block' }}
      data-ad-client={publisherId}
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
