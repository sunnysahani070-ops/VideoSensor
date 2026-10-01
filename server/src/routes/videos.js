import express from 'express';
import multer from 'multer';
import path from 'path';
import { initialVideos } from '../data/seedVideos.js';
import { saveFile } from '../services/storage.js';
import { createTranscodeJob, getJobStatus } from '../services/transcoder.js';

const router = express.Router();

// Multer temp upload configuration
const upload = multer({
  dest: path.resolve('temp_uploads'),
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

// In-memory data store initialized with seed videos
let videos = [...initialVideos];

// GET /api/videos - List with filtering, searching, and sorting
router.get('/', (req, res) => {
  const { search, category, sort = 'trending', limit } = req.query;

  let result = [...videos];

  if (category && category !== 'All') {
    result = result.filter(v => v.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(v => 
      v.title.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.channel.name.toLowerCase().includes(q) ||
      (v.tags && v.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  if (sort === 'trending') {
    result.sort((a, b) => b.views - a.views);
  } else if (sort === 'newest') {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'popular') {
    result.sort((a, b) => b.likes - a.likes);
  }

  if (limit) {
    result = result.slice(0, parseInt(limit, 10));
  }

  res.json({
    videos: result,
    total: result.length,
  });
});

// GET /api/videos/:id - Video detail & view count increment
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const video = videos.find(v => v.id === id);

  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  // Increment view count
  video.views = (video.views || 0) + 1;

  // Get related videos (same category or top videos excluding current)
  const related = videos
    .filter(v => v.id !== id)
    .slice(0, 8);

  const job = getJobStatus(id);

  res.json({
    video,
    related,
    job
  });
});

// POST /api/videos/:id/like - Like or dislike toggle
router.post('/:id/like', (req, res) => {
  const { id } = req.params;
  const { action = 'like' } = req.body; // 'like' or 'dislike'

  const video = videos.find(v => v.id === id);
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  if (action === 'like') {
    video.likes = (video.likes || 0) + 1;
  } else {
    video.dislikes = (video.dislikes || 0) + 1;
  }

  res.json({
    likes: video.likes,
    dislikes: video.dislikes
  });
});

// POST /api/videos/:id/comments - Add new comment
router.post('/:id/comments', (req, res) => {
  const { id } = req.params;
  const { author = 'You', content, avatar } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  const video = videos.find(v => v.id === id);
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  const newComment = {
    id: `c-${Date.now()}`,
    author: author.trim(),
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    content: content.trim(),
    createdAt: 'Just now',
    likes: 0
  };

  video.comments = [newComment, ...(video.comments || [])];

  res.status(201).json({
    comment: newComment,
    totalComments: video.comments.length
  });
});

// POST /api/videos/upload - Video file upload & job initiation
router.post('/upload', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, category = 'General', tags = '', visibility = 'public' } = req.body;
    const videoFile = req.files?.video?.[0];
    const thumbFile = req.files?.thumbnail?.[0];

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    let videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
    let thumbnailUrl = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1280&q=80';

    if (videoFile) {
      const savedVideo = await saveFile(videoFile);
      videoUrl = savedVideo.url;
    }

    if (thumbFile) {
      const savedThumb = await saveFile(thumbFile);
      thumbnailUrl = savedThumb.url;
    }

    const videoId = `vid-${Date.now()}`;
    const tagList = typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    const newVideo = {
      id: videoId,
      title,
      description: description || '',
      thumbnail: thumbnailUrl,
      videoUrl: videoUrl,
      hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      duration: 320,
      durationFormatted: '5:20',
      views: 1,
      likes: 1,
      dislikes: 0,
      category,
      tags: tagList.length > 0 ? tagList : ['VideoSensor', category],
      createdAt: new Date().toISOString(),
      visibility,
      channel: {
        id: 'ch-my-studio',
        name: 'My VideoSensor Studio',
        handle: '@mystudio',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
        subscribers: '1.4K',
        verified: true
      },
      monetization: {
        enabled: true,
        adFormats: ['banner', 'in_stream']
      },
      resolutions: ['1080p', '720p', '480p'],
      comments: []
    };

    // Prepend to catalog
    videos = [newVideo, ...videos];

    // Trigger transcode pipeline job
    const job = createTranscodeJob(videoId, newVideo);

    res.status(201).json({
      video: newVideo,
      job
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Video upload failed' });
  }
});

// GET /api/videos/:id/job - Transcode pipeline status
router.get('/:id/job', (req, res) => {
  const { id } = req.params;
  const job = getJobStatus(id);
  res.json({ job: job || { status: 'ready', progress: 100 } });
});

// DELETE /api/videos/:id - Delete video
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = videos.findIndex(v => v.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Video not found' });
  }
  videos.splice(index, 1);
  res.json({ success: true, message: 'Video deleted successfully' });
});

export default router;
