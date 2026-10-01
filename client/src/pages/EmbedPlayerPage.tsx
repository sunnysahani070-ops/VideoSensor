import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Video } from '../types';
import { fetchVideoById } from '../services/api';
import { VideoPlayer } from '../components/VideoPlayer';
import { ExternalLink } from 'lucide-react';

export const EmbedPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchVideoById(id)
      .then((data) => setVideo(data.video))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center text-xs text-slate-400">
        Video unavailable or removed
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black relative flex flex-col justify-center overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <VideoPlayer
          src={video.videoUrl}
          hlsSrc={video.hlsUrl}
          poster={video.thumbnail}
          autoPlay={false}
          isTheater={true}
        />
      </div>

      {/* Subtle watermark link to parent platform */}
      <a
        href={`/watch/${video.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-3 right-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/10 text-[10px] text-slate-300 font-semibold transition-all shadow-md"
        title="Watch on VideoSensor"
      >
        <span>VideoSensor</span>
        <ExternalLink className="w-3 h-3 text-cyan-400" />
      </a>
    </div>
  );
};
