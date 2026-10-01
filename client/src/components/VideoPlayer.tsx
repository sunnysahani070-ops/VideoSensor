import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  RotateCcw,
  RotateCw,
  Tv,
  PictureInPicture,
  Check
} from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  hlsSrc?: string;
  poster?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  isTheater?: boolean;
  onToggleTheater?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  hlsSrc,
  poster,
  autoPlay = false,
  onEnded,
  isTheater = false,
  onToggleTheater,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'root' | 'quality' | 'speed'>('root');
  
  const [selectedQuality, setSelectedQuality] = useState('Auto');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);

  const controlsTimeoutRef = useRef<any>(null);

  // Initialize playback (HLS or Native MP4)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const streamUrl = hlsSrc || src;

    if (streamUrl.endsWith('.m3u8') && Hls.isSupported()) {
      const hls = new Hls({
        capLevelToPlayerSize: true,
        autoStartLoad: true,
      });
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video.play().catch(() => setIsPlaying(false));
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          console.warn('HLS fatal error, falling back to direct MP4 source:', data.type);
          hls.destroy();
          video.src = src;
          if (autoPlay) video.play().catch(() => {});
        }
      });
    } else {
      video.src = src;
      if (autoPlay) {
        video.play().catch(() => setIsPlaying(false));
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, hlsSrc, autoPlay]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      video.volume = volume;
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnd = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnd);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnd);
    };
  }, [volume, onEnded]);

  // Keyboard hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const video = videoRef.current;
      if (!video) return;

      if (e.code === 'Space' || e.code === 'KeyK') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skipTime(-5);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skipTime(5);
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        changeVolume(Math.min(1, volume + 0.1));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        changeVolume(Math.max(0, volume - 0.1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [volume, isPlaying]);

  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(0, video.currentTime + seconds), duration);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeVolume = (newVol: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = newVol;
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const togglePip = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
      await video.requestPictureInPicture();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleMouseMoveSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    setHoverTime(pos * duration);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (!showSettings) setShowControls(false);
      }, 2500);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const setQuality = (q: string) => {
    setSelectedQuality(q);
    setShowSettings(false);
    setActiveTab('root');
  };

  const setSpeed = (spd: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = spd;
    }
    setPlaybackSpeed(spd);
    setShowSettings(false);
    setActiveTab('root');
  };

  const qualities = ['Auto', '1080p 60fps', '720p', '480p', '360p'];
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && !showSettings && setShowControls(false)}
      className={`relative w-full aspect-video bg-black overflow-hidden select-none group shadow-2xl ${
        isTheater ? 'rounded-none' : 'rounded-2xl'
      } border border-surface-border`}
    >
      <video
        ref={videoRef}
        poster={poster}
        onClick={togglePlay}
        playsInline
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Center Play Overlay when paused */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer transition-opacity"
        >
          <div className="w-20 h-20 rounded-full bg-brand-600/90 hover:bg-brand-500 text-white flex items-center justify-center shadow-glow transition-all transform hover:scale-110">
            <Play className="w-9 h-9 fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Top Bar inside player */}
      <div
        className={`absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-brand-500/20 border border-brand-500/40 text-[11px] font-semibold text-brand-300">
            HLS Adaptive
          </span>
          <span className="text-xs font-medium text-slate-300">{selectedQuality}</span>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar / Scrubber */}
        <div
          onClick={handleSeek}
          onMouseMove={handleMouseMoveSeek}
          onMouseLeave={() => setHoverTime(null)}
          className="relative w-full h-2 group/scrub cursor-pointer flex items-center mb-3"
        >
          {/* Background rail */}
          <div className="absolute inset-x-0 h-1 group-hover/scrub:h-2 rounded-full bg-slate-700/60 transition-all overflow-hidden">
            {/* Buffered */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-slate-500/50 rounded-full transition-all"
              style={{ width: `${duration ? (buffered / duration) * 100 : 0}%` }}
            />
            {/* Played */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-brand-500 to-indigo-400 rounded-full shadow-glow"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute -top-7 transform -translate-x-1/2 px-2 py-0.5 rounded bg-surface-dark border border-surface-border text-[11px] text-white font-mono pointer-events-none shadow-md"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}

          {/* Thumb marker */}
          <div
            className="absolute w-3.5 h-3.5 rounded-full bg-white shadow-glow opacity-0 group-hover/scrub:opacity-100 transition-opacity transform -translate-x-1/2 pointer-events-none"
            style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title={isPlaying ? 'Pause (k)' : 'Play (k)'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
            </button>

            {/* Skip 10s */}
            <button
              onClick={() => skipTime(-10)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors hidden sm:block"
              title="Rewind 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => skipTime(10)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors hidden sm:block"
              title="Fast Forward 10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume control */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title={isMuted ? 'Unmute (m)' : 'Mute (m)'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="w-16 sm:w-20 h-1 bg-slate-600 rounded-lg cursor-pointer"
              />
            </div>

            {/* Time Stamp */}
            <div className="text-xs font-mono text-slate-300 ml-1">
              <span>{formatTime(currentTime)}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 relative">
            {/* Settings Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSettings(!showSettings);
                  setActiveTab('root');
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  showSettings ? 'bg-white/20 text-brand-400' : 'hover:bg-white/10 text-white'
                }`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Settings Dropdown Popover */}
              {showSettings && (
                <div className="absolute right-0 bottom-10 w-48 rounded-xl bg-surface-dark/95 backdrop-blur-md border border-surface-border p-2 shadow-2xl text-xs z-50 animate-in fade-in zoom-in-95">
                  {activeTab === 'root' && (
                    <div className="space-y-1">
                      <button
                        onClick={() => setActiveTab('quality')}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/10 text-slate-200 transition-colors"
                      >
                        <span>Quality</span>
                        <span className="text-brand-400 font-semibold">{selectedQuality}</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('speed')}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/10 text-slate-200 transition-colors"
                      >
                        <span>Playback Speed</span>
                        <span className="text-brand-400 font-semibold">{playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}x`}</span>
                      </button>
                    </div>
                  )}

                  {activeTab === 'quality' && (
                    <div>
                      <button
                        onClick={() => setActiveTab('root')}
                        className="w-full text-left font-semibold text-slate-400 p-1.5 pb-2 mb-1 border-b border-surface-border"
                      >
                        ← Quality Options
                      </button>
                      <div className="space-y-0.5">
                        {qualities.map((q) => (
                          <button
                            key={q}
                            onClick={() => setQuality(q)}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/10 text-slate-200"
                          >
                            <span>{q}</span>
                            {selectedQuality === q && <Check className="w-4 h-4 text-brand-400" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'speed' && (
                    <div>
                      <button
                        onClick={() => setActiveTab('root')}
                        className="w-full text-left font-semibold text-slate-400 p-1.5 pb-2 mb-1 border-b border-surface-border"
                      >
                        ← Playback Speed
                      </button>
                      <div className="space-y-0.5">
                        {speeds.map((spd) => (
                          <button
                            key={spd}
                            onClick={() => setSpeed(spd)}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/10 text-slate-200"
                          >
                            <span>{spd === 1 ? '1.0x (Normal)' : `${spd}x`}</span>
                            {playbackSpeed === spd && <Check className="w-4 h-4 text-brand-400" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Picture-in-picture */}
            <button
              onClick={togglePip}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors hidden sm:block"
              title="Picture in Picture"
            >
              <PictureInPicture className="w-5 h-5" />
            </button>

            {/* Theater Mode */}
            {onToggleTheater && (
              <button
                onClick={onToggleTheater}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors hidden md:block"
                title={isTheater ? 'Default view (t)' : 'Theater mode (t)'}
              >
                <Tv className={`w-5 h-5 ${isTheater ? 'text-brand-400' : ''}`} />
              </button>
            )}

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen (f)' : 'Fullscreen (f)'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
