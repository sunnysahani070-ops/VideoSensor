import React, { useState } from 'react';
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

  if (closed) return null;

  if (type === 'leaderboard') {
    return (
      <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-r from-surface-darker via-surface-card to-surface-darker border border-surface-border p-3 sm:p-4 my-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="absolute top-1.5 right-2 flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
          <span>Sponsored Ad</span>
          <button 
            onClick={() => setClosed(true)} 
            className="hover:text-slate-300 transition-colors p-0.5" 
            title="Dismiss Ad"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-3.5 pr-8 sm:pr-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
            <span className="text-amber-400 font-bold text-lg font-display">AD</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-dark border border-surface-border text-slate-400">{sponsorName}</span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
        >
          <span>{ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-surface-card to-surface-darker border border-surface-border p-4 my-4 shadow-xl">
        <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2.5">
          <div className="flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-500" />
            <span>Sponsored by {sponsorName}</span>
          </div>
          <button 
            onClick={() => setClosed(true)} 
            className="hover:text-slate-300 transition-colors" 
            title="Dismiss Ad"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="aspect-[16/9] w-full rounded-xl bg-gradient-to-br from-indigo-950 via-surface-dark to-slate-900 border border-brand-500/20 p-4 flex flex-col justify-end relative overflow-hidden mb-3 group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_70%)]" />
          <div className="relative z-10">
            <span className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider">Premium Cloud Infrastructure</span>
            <h4 className="text-base font-bold text-white mt-1 leading-snug">{title}</h4>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-3.5">
          {subtitle}
        </p>

        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-glow transition-all"
        >
          <span>{ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
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

      <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-surface-dark via-brand-950/40 to-surface-card border border-surface-border flex items-center justify-center mb-3">
        <span className="text-sm font-semibold text-slate-300">{title}</span>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">{title}</h4>
        <p className="text-xs text-slate-400 line-clamp-2 mt-1">{subtitle}</p>
      </div>

      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3.5 w-full py-1.5 rounded-lg bg-surface-dark hover:bg-surface-darker border border-surface-border text-slate-300 hover:text-white text-xs font-medium text-center flex items-center justify-center gap-1.5 transition-colors"
      >
        <span>{ctaText}</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
