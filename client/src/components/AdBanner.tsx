import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Info, X } from 'lucide-react';

interface AdBannerProps {
  type: 'leaderboard' | 'sidebar' | 'in_feed';
  title?: string;
  subtitle?: string;
  sponsorName?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  type,
  title = "High-Performance Cloudflare R2 Storage",
  subtitle = "Zero egress fees. S3-compatible API. The ultimate storage for video delivery.",
  sponsorName = "Cloudflare Partner Network",
  ctaText = "Start Free Trial",
  ctaUrl = "https://www.cloudflare.com/products/r2/"
}) => {
  const [closed, setClosed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous children
    const container = containerRef.current;
    container.innerHTML = '';

    // Create the Adsterra container div
    const adDiv = document.createElement('div');
    adDiv.id = 'container-f548ee0efaacdff49d7b06890e3d4ecc';
    container.appendChild(adDiv);

    // Create and attach the Adsterra invoke.js script
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl31604840.profitableratecpmnetwork.com/f548ee0efaacdff49d7b06890e3d4ecc/invoke.js';
    container.appendChild(script);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [type]);

  if (closed) return null;

  if (type === 'leaderboard') {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-surface-darker via-surface-card to-surface-darker border border-surface-border p-3 sm:p-4 my-4 shadow-lg flex flex-col items-center">
        <div className="w-full flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Sponsored Advertisement</span>
          </span>
          <button 
            onClick={() => setClosed(true)} 
            className="hover:text-slate-300 transition-colors p-0.5" 
            title="Dismiss Ad"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Adsterra Native Banner Container */}
        <div ref={containerRef} className="w-full flex justify-center items-center min-h-[90px] overflow-hidden" />
      </div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-surface-card to-surface-darker border border-surface-border p-4 my-4 shadow-xl">
        <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2.5">
          <div className="flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-500" />
            <span>Sponsored by Adsterra</span>
          </div>
          <button 
            onClick={() => setClosed(true)} 
            className="hover:text-slate-300 transition-colors" 
            title="Dismiss Ad"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Adsterra Banner Container in Sidebar */}
        <div ref={containerRef} className="w-full flex justify-center items-center min-h-[120px] overflow-hidden rounded-xl bg-surface-dark/50" />
      </div>
    );
  }

  // in_feed
  return (
    <div className="relative rounded-2xl overflow-hidden bg-surface-card/60 hover:bg-surface-card border border-surface-border p-4 transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
          Promoted
        </span>
        <button onClick={() => setClosed(true)} className="text-slate-500 hover:text-slate-300">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div ref={containerRef} className="w-full flex justify-center items-center min-h-[90px] overflow-hidden" />
    </div>
  );
};
