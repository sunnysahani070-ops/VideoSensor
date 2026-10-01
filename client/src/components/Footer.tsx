import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HardDrive, Cpu, ExternalLink, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-surface-border bg-surface-darkest/90 mt-16 pt-12 pb-8 px-4 sm:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand Column */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-surface-darkest rounded-[7px] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-400" />
              </div>
            </div>
            <span className="font-display font-bold text-base text-white">VideoSensor</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Personal high-performance video streaming platform built with adaptive HLS transcoding, Cloudflare R2 zero-egress storage, and customizable creator monetization.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] text-brand-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AdSense & DMCA Compliant Architecture</span>
          </div>
        </div>

        {/* Platform Links */}
        <div>
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Streaming Engine</h4>
          <ul className="space-y-2 text-[11px]">
            <li><Link to="/" className="hover:text-white transition-colors">Public Video Feed</Link></li>
            <li><Link to="/explore" className="hover:text-white transition-colors">Trending & Popular</Link></li>
            <li><Link to="/studio" className="hover:text-white transition-colors">Upload & Transcode</Link></li>
            <li><Link to="/analytics" className="hover:text-white transition-colors">AdSense & Monetization Hub</Link></li>
            <li><Link to="/settings" className="hover:text-white transition-colors">Cloudflare R2 Storage</Link></li>
          </ul>
        </div>

        {/* Architecture Spec */}
        <div>
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Architecture Blueprint</h4>
          <ul className="space-y-2 text-[11px] text-slate-400">
            <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-brand-400" /> Fastify / Node REST API</li>
            <li className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-cyan-400" /> Cloudflare R2 / S3 Object Storage</li>
            <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> Multi-Bitrate HLS Transcoding (1080p, 720p, 480p)</li>
            <li>Docker & VPS Ready Deployment</li>
            <li>Display & In-Stream Ad Placements</li>
          </ul>
        </div>

        {/* Legal & Compliance */}
        <div>
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">Licensing & Rights</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Built upon the open-source Hovod MIT streaming architecture. Content uploaded requires verified distribution rights in compliance with advertising network guidelines.
          </p>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="text-slate-400 hover:text-white transition-colors cursor-pointer">DMCA Notice</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
        <div>© 2026 VideoSensor. Open-source personal streaming technology.</div>
        <div className="font-mono text-[10px]">Connected: 127.0.0.1:5000 | R2 Edge: Synced</div>
      </div>
    </footer>
  );
};
