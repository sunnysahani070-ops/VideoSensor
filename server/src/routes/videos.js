import express from 'express';
import multer from 'multer';
import path from 'path';
import { saveFile } from '../services/storage.js';
import { createTranscodeJob, getJobStatus } from '../services/transcoder.js';
import { requireAuth } from '../middleware/auth.js';
import {
  getVideos,
  getVideoById,
  incrementViews,
  updateLike,
  insertComment,
  insertVideo,
  removeVideo
} from '../services/db.js';

const router = express.Router();

// Multer temp upload configuration
const upload = multer({
  dest: path.resolve('temp_uploads'),
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

// GET /api/videos - List with filtering, searching, and sorting
router.get('/', async (req, res) => {
  try {
    const { search, category, sort = 'trending', limit } = req.query;
    const result = await getVideos({ search, category, sort, limit });

    res.json({
      videos: result,
      total: result.length,
    });
  } catch (err) {
    console.error('Error fetching videos:', err);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// GET /api/videos/:id - Video detail & view count increment
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const video = await getVideoById(id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Increment view count in background
    await incrementViews(id);
    video.views = (video.views || 0) + 1;

    // Get related videos
    const allVideos = await getVideos({ limit: 9 });
    const related = allVideos.filter(v => v.id !== id).slice(0, 8);
    const job = getJobStatus(id);

    res.json({
      video,
      related,
      job
    });
  } catch (err) {
    console.error('Error fetching video detail:', err);
    res.status(500).json({ error: 'Failed to fetch video detail' });
  }
});

// POST /api/videos/:id/like - Like or dislike toggle
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { action = 'like' } = req.body; // 'like' or 'dislike'

    const result = await updateLike(id, action);
    res.json(result);
  } catch (err) {
    console.error('Error updating reaction:', err);
    res.status(500).json({ error: 'Failed to update reaction' });
  }
});

// POST /api/videos/:id/comments - Add new comment
router.post('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { author = 'You', content, avatar } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const newComment = {
      id: `c-${Date.now()}`,
      author: author.trim(),
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      content: content.trim(),
      createdAt: 'Just now',
      likes: 0
    };

    await insertComment(id, newComment);

    const video = await getVideoById(id);

    res.status(201).json({
      comment: newComment,
      totalComments: video ? (video.comments?.length || 1) : 1
    });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

// POST /api/videos/upload - Video file upload & job initiation (Protected)
router.post('/upload', requireAuth, upload.fields([
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

    // Insert into database
    await insertVideo(newVideo);

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

// DELETE /api/videos/:id - Delete video (Protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await removeVideo(id);
    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (err) {
    console.error('Error deleting video:', err);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

export default router;
