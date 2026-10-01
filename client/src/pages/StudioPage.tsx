import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Upload,
  Film,
  Image,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  HardDrive,
  Trash2,
  ExternalLink,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Video, TranscodeJob } from '../types';
import { uploadVideo, fetchVideos, deleteVideo, fetchJobStatus } from '../services/api';

export const StudioPage: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tech');
  const [tags, setTags] = useState('VideoSensor, 4K, HLS');
  const [visibility, setVisibility] = useState<'public' | 'unlisted' | 'private'>('public');
  const [monetization, setMonetization] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [activeJob, setActiveJob] = useState<TranscodeJob | null>(null);
  const [newlyCreatedVideo, setNewlyCreatedVideo] = useState<Video | null>(null);
  const [myVideos, setMyVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const loadMyVideos = async () => {
    try {
      const res = await fetchVideos({ limit: 20 });
      setMyVideos(res.videos);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    loadMyVideos();
  }, []);

  // Poll transcode job status
  useEffect(() => {
    if (!activeJob || activeJob.status === 'ready') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetchJobStatus(activeJob.videoId);
        if (res.job) {
          setActiveJob(res.job);
          if (res.job.status === 'ready') {
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
            loadMyVideos();
          }
        }
      } catch (e) {
        console.error(e);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [activeJob]);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleThumbSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setUploadError('Please provide a title for the video.');
      return;
    }

    setUploadError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('visibility', visibility);
    formData.append('monetization', monetization ? 'true' : 'false');

    if (videoFile) {
      formData.append('video', videoFile);
    }
    if (thumbFile) {
      formData.append('thumbnail', thumbFile);
    }

    try {
      const res = await uploadVideo(formData);
      setNewlyCreatedVideo(res.video);
      setActiveJob(res.job);
      setVideoFile(null);
      setThumbFile(null);
      setTitle('');
      setDescription('');
      loadMyVideos();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video from VideoSensor and Cloudflare R2?')) return;
    try {
      await deleteVideo(id);
      setMyVideos(myVideos.filter((v) => v.id !== id));
      if (newlyCreatedVideo?.id === id) {
        setNewlyCreatedVideo(null);
        setActiveJob(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hovod Processing Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Creator Studio & Ingestion Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload original videos, trigger automated FFmpeg HLS transcoding ladders, and sync to Cloudflare R2 storage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/analytics"
            className="px-4 py-2 rounded-xl bg-surface-card hover:bg-surface-cardHover border border-surface-border text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Revenue Hub</span>
          </Link>
          <Link
            to="/settings"
            className="px-4 py-2 rounded-xl bg-surface-card hover:bg-surface-cardHover border border-surface-border text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            <span>R2 Config</span>
          </Link>
        </div>
      </div>

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Active Transcoding Pipeline Visualizer */}
      {activeJob && (
        <div className="rounded-3xl bg-gradient-to-b from-surface-card to-surface-darkest border border-brand-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-brand-400 font-semibold">
                Transcoding Job: {activeJob.id}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {activeJob.status === 'ready'
                  ? 'Video Processing Complete & Published!'
                  : 'Processing HLS Bitrate Ladder...'}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-cyan-400">
                {activeJob.progress}%
              </span>
              {activeJob.status === 'ready' && newlyCreatedVideo && (
                <Link
                  to={`/watch/${newlyCreatedVideo.id}`}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-glow flex items-center gap-1.5 transition-all"
                >
                  <span>Watch Stream</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 rounded-full bg-surface-dark overflow-hidden border border-surface-border">
            <div
              className="h-full bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500 shadow-glow"
              style={{ width: `${activeJob.progress}%` }}
            />
          </div>

          {/* Processing Stages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            {activeJob.stages.map((stg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl border text-xs flex flex-col justify-between space-y-2 transition-all ${
                  stg.status === 'completed'
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : stg.status === 'in_progress'
                    ? 'bg-brand-950/30 border-brand-500/50 text-white shadow-glow/10 animate-pulse'
                    : 'bg-surface-darker/60 border-surface-border text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono">Stage 0{i + 1}</span>
                  {stg.status === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : stg.status === 'in_progress' ? (
                    <div className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>
                <span className="font-semibold leading-tight line-clamp-2">{stg.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Video Dropzone & Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl bg-surface-card border border-surface-border p-6 space-y-5">
            <h3 className="font-semibold text-base text-white font-display">Video Asset Details</h3>

            {/* Video File Dropzone */}
            <div className="relative border-2 border-dashed border-surface-border hover:border-brand-500 rounded-2xl p-8 text-center transition-colors group cursor-pointer bg-surface-darker/50">
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                onChange={handleVideoSelect}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="flex flex-col items-center space-y-3 pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 group-hover:bg-brand-500/20 text-brand-400 flex items-center justify-center transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    {videoFile ? videoFile.name : 'Select or drag & drop a video file'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {videoFile
                      ? `${(videoFile.size / (1024 * 1024)).toFixed(1)} MB • Ready to transcode`
                      : 'MP4, WebM, MOV up to 500MB (Simulated 4K/1080p pipeline)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Video Title <span className="text-brand-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Next-Gen Ray Tracing Performance Benchmark 4K"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-surface-darker border border-surface-border focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Description & Timestamps
              </label>
              <textarea
                rows={4}
                placeholder="Describe your stream, mention chapters, or add distribution attribution..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-surface-darker border border-surface-border focus:border-brand-500 rounded-xl p-3 text-xs sm:text-sm text-slate-100 outline-none transition-all resize-y"
              />
            </div>

            {/* Category & Tags Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-darker border border-surface-border focus:border-brand-500 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none"
                >
                  <option value="Tech">Tech & AI</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Music">Music & Audio</option>
                  <option value="Movies & Shows">Movies & Shows</option>
                  <option value="Nature">Nature & Travel</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4k, tech, coding"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-surface-darker border border-surface-border focus:border-brand-500 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Thumbnail, Visibility & Publish */}
        <div className="lg:col-span-4 space-y-6">
          {/* Thumbnail Dropzone */}
          <div className="rounded-2xl bg-surface-card border border-surface-border p-5 space-y-4">
            <h3 className="font-semibold text-sm text-white font-display">Thumbnail Poster</h3>
            <div className="relative aspect-video rounded-xl border border-dashed border-surface-border hover:border-brand-500 bg-surface-darker flex flex-col items-center justify-center p-4 text-center cursor-pointer overflow-hidden group">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbSelect}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              {thumbFile ? (
                <div className="space-y-1">
                  <Image className="w-8 h-8 text-brand-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-200 line-clamp-1">{thumbFile.name}</p>
                  <p className="text-[10px] text-emerald-400">Custom poster loaded</p>
                </div>
              ) : (
                <div className="space-y-1 pointer-events-none">
                  <Image className="w-7 h-7 text-slate-500 group-hover:text-brand-400 mx-auto transition-colors" />
                  <p className="text-xs text-slate-300 font-medium">Upload custom thumbnail</p>
                  <p className="text-[10px] text-slate-500">Auto-extracted from frame if left blank</p>
                </div>
              )}
            </div>
          </div>

          {/* Visibility & Monetization Card */}
          <div className="rounded-2xl bg-surface-card border border-surface-border p-5 space-y-4 text-xs">
            <h3 className="font-semibold text-sm text-white font-display">Publishing & Monetization</h3>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="w-full bg-surface-darker border border-surface-border rounded-xl px-3 py-2 text-slate-200 outline-none"
              >
                <option value="public">Public (Everyone can watch)</option>
                <option value="unlisted">Unlisted (Anyone with link)</option>
                <option value="private">Private (Only you)</option>
              </select>
            </div>

            {/* Monetization Switch */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-darker border border-surface-border">
              <div>
                <span className="font-semibold text-slate-200 block">Enable Monetization</span>
                <span className="text-[10px] text-slate-400">Show display & in-stream ads</span>
              </div>
              <input
                type="checkbox"
                checked={monetization}
                onChange={(e) => setMonetization(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Ingesting Stream...' : 'Publish & Start Transcoding'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* User's Video Catalog Management Table */}
      <div className="pt-6 border-t border-surface-border space-y-4">
        <h3 className="font-display font-bold text-lg text-white">Your Streaming Catalog</h3>
        
        {loadingVideos ? (
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 rounded-xl bg-surface-card border border-surface-border animate-pulse" />
            ))}
          </div>
        ) : myVideos.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No videos uploaded yet.</p>
        ) : (
          <div className="rounded-2xl border border-surface-border overflow-hidden bg-surface-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-darker text-slate-400 font-semibold border-b border-surface-border uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Video</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Visibility</th>
                    <th className="py-3 px-4">Views</th>
                    <th className="py-3 px-4">Likes</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border text-slate-300">
                  {myVideos.map((vid) => (
                    <tr key={vid.id} className="hover:bg-surface-dark/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={vid.thumbnail}
                            alt={vid.title}
                            className="w-14 aspect-video rounded-lg object-cover border border-surface-border shrink-0"
                          />
                          <div>
                            <Link to={`/watch/${vid.id}`} className="font-semibold text-slate-100 hover:text-brand-300 line-clamp-1">
                              {vid.title}
                            </Link>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {vid.durationFormatted} • HLS Adaptive
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-surface-dark border border-surface-border text-[10px] text-slate-300">
                          {vid.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 font-medium">Public</span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {(vid.views || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {(vid.likes || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/watch/${vid.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-300 hover:bg-surface-dark transition-colors"
                            title="Watch Stream"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(vid.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-surface-dark transition-colors"
                            title="Delete Video"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
