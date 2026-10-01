import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, Flame, CheckCircle2, RefreshCw } from 'lucide-react';
import { Video } from '../types';
import { fetchVideos } from '../services/api';
import { VideoCard } from '../components/VideoCard';
import { AdBanner } from '../components/AdBanner';
import { ShareModal } from '../components/ShareModal';

export const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [shareVideo, setShareVideo] = useState<Video | null>(null);

  const categories = [
    'All',
    'Gaming',
    'Tech',
    'Music',
    'Movies & Shows',
    'Nature',
    'Education',
  ];

  const loadVideos = async () => {
    setLoading(true);
    try {
      const res = await fetchVideos({
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        sort: 'trending',
      });
      setVideos(res.videos);
    } catch (err) {
      console.error('Failed to load videos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [selectedCategory]);

  const featuredVideo = videos[0];
  const regularVideos = videos.slice(1);

  return (
    <div className="space-y-8 pb-12">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-glow'
                : 'bg-surface-card hover:bg-surface-cardHover text-slate-300 border border-surface-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Video Hero (From Section 15 of Plan) */}
      {featuredVideo && selectedCategory === 'All' && (
        <div className="relative rounded-3xl overflow-hidden border border-surface-border bg-gradient-to-b from-surface-card to-surface-darkest p-6 sm:p-8 shadow-2xl">
          {/* Ambient blurred backdrop */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-3xl"
            style={{ backgroundImage: `url(${featuredVideo.thumbnail})` }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Featured Stream • 4K Adaptive HLS</span>
              </div>

              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold font-display text-white tracking-tight leading-snug">
                {featuredVideo.title}
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                {featuredVideo.description}
              </p>

              {/* Channel & Stats */}
              <div className="flex items-center gap-3 py-1">
                <img
                  src={featuredVideo.channel.avatar}
                  alt={featuredVideo.channel.name}
                  className="w-10 h-10 rounded-full object-cover border border-surface-border"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <span>{featuredVideo.channel.name}</span>
                    {featuredVideo.channel.verified && <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {(featuredVideo.views).toLocaleString()} views • {featuredVideo.durationFormatted}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  to={`/watch/${featuredVideo.id}`}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-glow transition-all transform hover:scale-[1.02]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Now</span>
                </Link>
                <button
                  onClick={() => setShareVideo(featuredVideo)}
                  className="px-4 py-2.5 rounded-xl bg-surface-dark hover:bg-surface-card border border-surface-border text-slate-200 text-xs sm:text-sm font-semibold transition-colors"
                >
                  Share
                </button>
              </div>
            </div>

            {/* Right Video Thumbnail / Preview Column */}
            <div className="lg:col-span-6">
              <Link to={`/watch/${featuredVideo.id}`} className="block relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-surface-border group">
                <img
                  src={featuredVideo.thumbnail}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-white ml-1" />
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/80 font-mono text-xs text-white">
                  {featuredVideo.durationFormatted}
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Advertisement */}
      <AdBanner
        type="leaderboard"
        title="Deploy VideoSensor to Your Own VPS with Cloudflare R2"
        subtitle="Enjoy unmetered bandwidth, automated FFmpeg transcoding, and zero egress streaming."
        sponsorName="Cloudflare R2 Storage"
        ctaText="View Docs"
        ctaUrl="https://developers.cloudflare.com/r2/"
      />

      {/* Trending & Catalog Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-bold font-display text-white">
              {selectedCategory === 'All' ? 'Trending Streams' : `${selectedCategory} Streams`}
            </h2>
          </div>
          <button
            onClick={loadVideos}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl bg-surface-card/40 border border-surface-border animate-pulse p-4 space-y-3">
                <div className="aspect-video bg-surface-dark rounded-xl" />
                <div className="h-4 bg-surface-dark rounded w-3/4" />
                <div className="h-3 bg-surface-dark rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(selectedCategory === 'All' ? regularVideos : videos).map((v) => (
              <VideoCard
                key={v.id}
                video={v}
                onShare={(vid) => setShareVideo(vid)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {shareVideo && (
        <ShareModal
          video={shareVideo}
          isOpen={Boolean(shareVideo)}
          onClose={() => setShareVideo(null)}
        />
      )}
    </div>
  );
};
