export interface Channel {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  subscribers: string;
  verified?: boolean;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  hlsUrl?: string;
  duration: number;
  durationFormatted: string;
  views: number;
  likes: number;
  dislikes: number;
  category: string;
  tags: string[];
  createdAt: string;
  channel: Channel;
  visibility?: 'public' | 'unlisted' | 'private';
  monetization?: {
    enabled: boolean;
    adFormats: string[];
  };
  resolutions: string[];
  comments?: Comment[];
}

export interface TranscodeStage {
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
}

export interface TranscodeJob {
  id: string;
  videoId: string;
  status: 'queued' | 'transcoding' | 'generating_hls' | 'ready' | 'error';
  progress: number;
  stages: TranscodeStage[];
  createdAt: string;
  completedAt?: string;
}

export interface StorageConfig {
  mode: 'local' | 'r2';
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  publicBaseUrl: string;
  forcePathStyle: boolean;
  isConfigured: boolean;
}

export interface AnalyticsData {
  period: string;
  overview: {
    totalViews: number;
    totalWatchHours: number;
    totalRevenue: number;
    totalImpressions: number;
    rpm: number;
    cpm: number;
    subscriberGrowth: number;
  };
  chartData: Array<{
    date: string;
    views: number;
    watchHours: number;
    revenue: number;
    impressions: number;
  }>;
  topVideos: Array<{
    id: string;
    title: string;
    views: number;
    revenue: number;
    avgDuration: string;
  }>;
  adPerformance: Array<{
    format: string;
    revenue: number;
    share: string;
  }>;
}
