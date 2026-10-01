import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MoreVertical, Clock, Share2, Copy, Check } from 'lucide-react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onShare?: (video: Video) => void;
  layout?: 'grid' | 'horizontal';
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onShare, layout = 'grid' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/watch/${video.id}`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowMenu(false);
    }, 1500);
  };

  if (layout === 'horizontal') {
    return (
      <div className="flex gap-3 group relative rounded-xl p-2 hover:bg-surface-card/60 transition-all">
        <Link to={`/watch/${video.id}`} className="relative w-40 sm:w-48 aspect-video rounded-xl overflow-hidden shrink-0 bg-surface-card border border-surface-border">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white font-medium">
            {video.durationFormatted}
          </span>
        </Link>

        <div className="flex-1 min-w-0 py-0.5">
          <Link to={`/watch/${video.id}`}>
            <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-brand-300 line-clamp-2 leading-snug transition-colors">
              {video.title}
            </h4>
          </Link>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
            <span className="truncate">{video.channel.name}</span>
            {video.channel.verified && <CheckCircle2 className="w-3 h-3 text-brand-400 shrink-0" />}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 font-mono">
            <span>{formatViews(video.views)}</span>
            <span>•</span>
            <span>{video.createdAt.slice(0, 10)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group relative flex flex-col rounded-2xl bg-surface-card/40 hover:bg-surface-card border border-surface-border hover:border-surface-borderHover hover:shadow-glow/20 transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      {/* Thumbnail area */}
      <Link to={`/watch/${video.id}`} className="relative aspect-video w-full overflow-hidden bg-surface-darkest">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Quality pill */}
        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-brand-300 uppercase tracking-wider">
          {video.resolutions?.[0] || '1080p'}
        </span>

        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-sm font-mono text-[11px] text-white font-medium border border-white/10 shadow-sm">
          {video.durationFormatted}
        </span>
      </Link>

      {/* Meta area */}
      <div className="p-3.5 flex gap-3">
        <Link to={`/watch/${video.id}`} className="shrink-0 pt-0.5">
          <img
            src={video.channel.avatar}
            alt={video.channel.name}
            className="w-9 h-9 rounded-full object-cover border border-surface-border group-hover:border-brand-500/50 transition-colors"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <Link to={`/watch/${video.id}`}>
              <h3 className="text-sm font-semibold text-slate-100 group-hover:text-brand-300 line-clamp-2 leading-snug transition-colors">
                {video.title}
              </h3>
            </Link>

            {/* 3-dots Menu Button */}
            <div className="relative shrink-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-surface-dark transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div 
                  className="absolute right-0 top-7 w-40 rounded-xl glass-dropdown p-1.5 text-xs z-30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={handleCopy}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                  </button>
                  {onShare && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onShare(video);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Video</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="truncate hover:text-slate-200 transition-colors">{video.channel.name}</span>
            {video.channel.verified && <CheckCircle2 className="w-3 h-3 text-brand-400 shrink-0" />}
          </div>

          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span>{formatViews(video.views)}</span>
            <span>•</span>
            <span>{video.createdAt.slice(0, 10)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
