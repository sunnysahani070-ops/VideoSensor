import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Flame, Compass, Search, Filter, Sparkles } from 'lucide-react';
import { Video } from '../types';
import { fetchVideos } from '../services/api';
import { VideoCard } from '../components/VideoCard';
import { ShareModal } from '../components/ShareModal';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('trending');
  const [shareVideo, setShareVideo] = useState<Video | null>(null);

  const categories = [
    'All',
    'Gaming',
    'Tech',
    'Music',
    'Movies & Shows',
    'Nature',
    'Education'
  ];

  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    const s = searchParams.get('search') || '';
    setCategory(cat);
    setSearch(s);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetchVideos({
      search: search || undefined,
      category: category === 'All' ? undefined : category,
      sort: sortBy,
    })
      .then((data) => setVideos(data.videos))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [category, search, sortBy]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-rose-500 flex items-center justify-center shadow-glow-rose">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
              {search ? `Search Results for "${search}"` : 'Trending & Explore'}
            </h1>
            <p className="text-xs text-slate-400">
              Discover top trending broadcasts, multi-bitrate HLS streams, and popular content.
            </p>
          </div>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface-card border border-surface-border rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-brand-500"
          >
            <option value="trending">Most Viewed</option>
            <option value="popular">Most Liked</option>
            <option value="newest">Recently Uploaded</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setSearchParams(cat === 'All' ? {} : { category: cat });
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              category === cat
                ? 'bg-brand-600 text-white shadow-glow'
                : 'bg-surface-card hover:bg-surface-cardHover text-slate-300 border border-surface-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
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
      ) : videos.length === 0 ? (
        <div className="py-20 text-center space-y-3 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-surface-card border border-surface-border mx-auto flex items-center justify-center">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-white">No streams found</h3>
          <p className="text-xs text-slate-400">
            We couldn't find any videos matching your search filters. Try exploring a different category or upload a video.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video, idx) => (
            <div key={video.id} className="relative">
              {/* Optional rank badge for top trending */}
              {sortBy === 'trending' && !search && (
                <div className="absolute -top-2 -left-2 z-20 w-6 h-6 rounded-full bg-gradient-to-tr from-brand-600 to-rose-500 text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-md border border-white/20">
                  {idx + 1}
                </div>
              )}
              <VideoCard video={video} onShare={(v) => setShareVideo(v)} />
            </div>
          ))}
        </div>
      )}

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
