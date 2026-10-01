import fs from 'fs';
import path from 'path';

// Active processing jobs in memory
const processingJobs = new Map();

export function createTranscodeJob(videoId, videoData) {
  const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  
  const job = {
    id: jobId,
    videoId,
    status: 'queued', // 'queued' | 'transcoding' | 'generating_hls' | 'ready' | 'error'
    progress: 5,
    stages: [
      { name: 'Upload Validation', status: 'completed' },
      { name: 'Audio Demuxing & Waveform', status: 'in_progress' },
      { name: 'HLS Multi-Bitrate Ladder (1080p, 720p, 480p)', status: 'pending' },
      { name: 'Thumbnail Sprites & Poster', status: 'pending' },
      { name: 'Cloud Storage Sync (R2 / S3)', status: 'pending' }
    ],
    createdAt: new Date().toISOString(),
  };

  processingJobs.set(videoId, job);

  // Simulate background transcoding pipeline (as BullMQ worker does in Hovod)
  simulatePipeline(videoId, videoData);

  return job;
}

export function getJobStatus(videoId) {
  return processingJobs.get(videoId) || null;
}

function simulatePipeline(videoId, videoData) {
  const delays = [
    { progress: 25, stageIdx: 1, nextIdx: 2 },
    { progress: 55, stageIdx: 2, nextIdx: 3 },
    { progress: 80, stageIdx: 3, nextIdx: 4 },
    { progress: 100, stageIdx: 4, nextIdx: null, status: 'ready' }
  ];

  let currentStep = 0;
  const interval = setInterval(() => {
    const job = processingJobs.get(videoId);
    if (!job) {
      clearInterval(interval);
      return;
    }

    if (currentStep < delays.length) {
      const step = delays[currentStep];
      job.progress = step.progress;
      job.status = step.status || 'transcoding';
      
      if (job.stages[step.stageIdx]) {
        job.stages[step.stageIdx].status = 'completed';
      }
      if (step.nextIdx !== null && job.stages[step.nextIdx]) {
        job.stages[step.nextIdx].status = 'in_progress';
      }

      currentStep++;
    } else {
      job.status = 'ready';
      job.completedAt = new Date().toISOString();
      clearInterval(interval);
    }
  }, 1200);
}

// Generate dynamic HLS master playlist for adaptive bitrate streaming
export function generateMasterPlaylist(baseUrl, videoId) {
  return `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080,FRAME-RATE=60.000,CODECS="avc1.64002a,mp4a.40.2"
${baseUrl}/api/stream/${videoId}/1080p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720,FRAME-RATE=30.000,CODECS="avc1.4d401f,mp4a.40.2"
${baseUrl}/api/stream/${videoId}/720p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480,FRAME-RATE=30.000,CODECS="avc1.4d401e,mp4a.40.2"
${baseUrl}/api/stream/${videoId}/480p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360,FRAME-RATE=30.000,CODECS="avc1.42e01e,mp4a.40.2"
${baseUrl}/api/stream/${videoId}/360p.m3u8
`;
}
