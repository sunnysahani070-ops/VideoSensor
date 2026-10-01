import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Bookmark,
  CheckCircle2,
  Bell,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Send
} from 'lucide-react';
import { Video, Comment } from '../types';
import { fetchVideoById, likeVideo, addComment } from '../services/api';
import { VideoPlayer } from '../components/VideoPlayer';
import { VideoCard } from '../components/VideoCard';
import { AdBanner } from '../components/AdBanner';
import { ShareModal } from '../components/ShareModal';

export const WatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [video, setVideo] = useState<Video | null>(null);
  const [related, setRelated] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchVideoById(id)
      .then((data) => {
        setVideo(data.video);
        setRelated(data.related || []);
        window.scrollTo(0, 0);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!video) return;
    try {
      const nextLiked = !liked;
      setLiked(nextLiked);
      if (disliked) setDisliked(false);

      const res = await likeVideo(video.id, 'like');
      setVideo({ ...video, likes: res.likes });
      if (nextLiked) {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
      }
    } catch (e) {}
  };

  const handleDislike = async () => {
    if (!video) return;
    try {
      setDisliked(!disliked);
      if (liked) setLiked(false);
      const res = await likeVideo(video.id, 'dislike');
      setVideo({ ...video, dislikes: res.dislikes });
    } catch (e) {}
  };

  const handleSubscribe = () => {
    const nextSub = !subscribed;
    setSubscribed(nextSub);
    if (nextSub) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video || !commentText.trim()) return;

    setPostingComment(true);
    try {
      const res = await addComment(video.id, commentText);
      setVideo({
        ...video,
        comments: [res.comment, ...(video.comments || [])]
      });
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setPostingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 animate-pulse space-y-6">
        <div className="aspect-video w-full rounded-2xl bg-surface-card" />
        <div className="h-6 w-2/3 bg-surface-card rounded" />
        <div className="h-4 w-1/3 bg-surface-card rounded" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Video Not Found</h2>
        <p className="text-slate-400">The video you are looking for does not exist or has been removed.</p>
        <Link to="/" className="inline-block px-5 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto pb-16 ${isTheater ? 'px-0 sm:px-2' : ''}`}>
      {/* Top Banner Advertisement */}
      <div className="px-2 sm:px-0">
        <AdBanner
          type="leaderboard"
          title="VideoSensor Pro - Deploy High Resolution HLS to Cloudflare R2"
          subtitle="Instant global edge delivery with no egress fees. Get started with self-hosted streaming."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Player Column */}
        <div className={isTheater ? 'lg:col-span-12' : 'lg:col-span-8'}>
          {/* Custom HLS Video Player */}
          <VideoPlayer
            src={video.videoUrl}
            hlsSrc={video.hlsUrl}
            poster={video.thumbnail}
            autoPlay={true}
            isTheater={isTheater}
            onToggleTheater={() => setIsTheater(!isTheater)}
          />

          <div className="mt-4 px-2 sm:px-0 space-y-4">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white leading-snug">
              {video.title}
            </h1>

            {/* Meta & Interaction Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
              {/* Channel Profile */}
              <div className="flex items-center gap-3.5">
                <img
                  src={video.channel.avatar}
                  alt={video.channel.name}
                  className="w-11 h-11 rounded-full object-cover border border-surface-border shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    <span>{video.channel.name}</span>
                    {video.channel.verified && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {video.channel.subscribers} subscribers
                  </span>
                </div>

                {/* Subscribe Button */}
                <button
                  onClick={handleSubscribe}
                  className={`ml-3 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    subscribed
                      ? 'bg-surface-card hover:bg-surface-dark border border-surface-border text-slate-300'
                      : 'bg-white hover:bg-slate-200 text-slate-950 shadow-md font-bold'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{subscribed ? 'Subscribed' : 'Subscribe'}</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {/* Like / Dislike pill */}
                <div className="flex items-center rounded-full bg-surface-card border border-surface-border p-1">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      liked ? 'text-brand-400 bg-brand-500/20' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{(video.likes || 0).toLocaleString()}</span>
                  </button>
                  <div className="w-[1px] h-4 bg-surface-border mx-1" />
                  <button
                    onClick={handleDislike}
                    className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                      disliked ? 'text-rose-400 bg-rose-500/20' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Share Button */}
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-card hover:bg-surface-cardHover border border-surface-border text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                {/* Download Button */}
                <a
                  href={video.videoUrl}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-card hover:bg-surface-cardHover border border-surface-border text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </div>
            </div>

            {/* Description Card */}
            <div className="rounded-2xl bg-surface-card/60 border border-surface-border p-4 text-xs space-y-2">
              <div className="flex items-center gap-3 text-slate-300 font-semibold font-mono">
                <span>{(video.views || 0).toLocaleString()} views</span>
                <span>•</span>
                <span>Uploaded {new Date(video.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span className="text-cyan-400 font-normal">#{video.category}</span>
              </div>

              <div className={`text-slate-300 whitespace-pre-line leading-relaxed ${!showFullDesc ? 'line-clamp-3' : ''}`}>
                {video.description}
              </div>

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {video.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-surface-dark border border-surface-border text-[11px] text-brand-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="flex items-center gap-1 font-semibold text-slate-400 hover:text-white pt-1 transition-colors"
              >
                <span>{showFullDesc ? 'Show less' : 'Show more'}</span>
                {showFullDesc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Middle In-Feed Ad Banner */}
            <AdBanner
              type="leaderboard"
              title="Cloudflare R2 Object Storage: The Zero-Egress Choice for Streaming"
              subtitle="Deliver full-resolution HLS media playlists worldwide without unexpected bandwidth spikes."
              sponsorName="Sponsored"
            />

            {/* Comments Section */}
            <div className="pt-4 space-y-6">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white font-display">
                  Comments
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {(video.comments?.length || 0)}
                </span>
              </div>

              {/* New Comment Input */}
              <form onSubmit={handleAddComment} className="flex gap-3 items-start">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"
                  alt="You"
                  className="w-9 h-9 rounded-full object-cover border border-surface-border shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Add a public comment to this video..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full bg-surface-card border border-surface-border focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 outline-none transition-all"
                  />
                  <div className="flex justify-end gap-2">
                    {commentText && (
                      <button
                        type="button"
                        onClick={() => setCommentText('')}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={postingComment || !commentText.trim()}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold shadow-glow transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{postingComment ? 'Posting...' : 'Comment'}</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {video.comments && video.comments.length > 0 ? (
                  video.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 text-xs">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200">{comment.author}</span>
                          <span className="text-[11px] text-slate-500">{comment.createdAt}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{comment.content}</p>
                        <div className="flex items-center gap-2 pt-1 text-slate-400">
                          <button className="flex items-center gap-1 hover:text-brand-400 transition-colors">
                            <ThumbsUp className="w-3 h-3" />
                            <span className="text-[10px]">{comment.likes || 0}</span>
                          </button>
                          <button className="hover:text-slate-200 text-[11px] transition-colors">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-4 text-center">No comments yet. Be the first to share your thoughts!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Sponsored Ad & Up Next / Related Videos */}
        <div className={isTheater ? 'lg:col-span-12 mt-8' : 'lg:col-span-4 space-y-4'}>
          {/* Sidebar Sticky Sponsored Ad Card */}
          <AdBanner
            type="sidebar"
            title="Accelerate Transcoding with VideoSensor Worker"
            subtitle="Automatically generate 1080p, 720p, 480p, and 360p HLS video packages directly to Cloudflare R2 object storage."
            sponsorName="VideoSensor Cloud"
          />

          <h3 className="font-display font-bold text-sm text-white px-2 pt-2">
            Related Streams
          </h3>

          <div className="space-y-2">
            {related.map((relVideo) => (
              <VideoCard
                key={relVideo.id}
                video={relVideo}
                layout="horizontal"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        video={video}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
};
