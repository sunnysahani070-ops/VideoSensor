import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import videoRoutes from './routes/videos.js';
import analyticsRoutes from './routes/analytics.js';
import settingsRoutes from './routes/settings.js';
import { generateMasterPlaylist } from './services/transcoder.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
const CLIENT_DIST = path.resolve(__dirname, '../../client/dist');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads serving
app.use('/uploads', express.static(UPLOADS_DIR));

// API Routes
app.use('/api/videos', videoRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);

// HLS Manifest and Streaming Endpoint
app.get('/api/stream/:id/master.m3u8', (req, res) => {
  const { id } = req.params;
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const playlist = generateMasterPlaylist(baseUrl, id);
  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  res.send(playlist);
});

// Mock rendition playlists for adaptive testing
app.get('/api/stream/:id/:resolution.m3u8', (req, res) => {
  const { id, resolution } = req.params;
  const playlist = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:10.0,
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4
#EXT-X-ENDLIST`;
  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  res.send(playlist);
});

// Partial content video streaming with Range requests
app.get('/api/stream/file/:filename', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

// Serve frontend in production
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res) => {
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      service: 'VideoSensor API',
      status: 'online',
      version: '1.0.0',
      clientDevUrl: 'http://localhost:5173'
    });
  });
}

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🎬 VideoSensor Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/videos`);
  console.log(`⚡ Storage mode: ${process.env.STORAGE_MODE || 'local fallback'}`);
  console.log(`===============================================`);
});
