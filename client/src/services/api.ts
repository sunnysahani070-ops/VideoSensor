import { Video, StorageConfig, AnalyticsData, TranscodeJob } from '../types';

const API_BASE = '/api';

export async function fetchVideos(params?: {
  search?: string;
  category?: string;
  sort?: string;
  limit?: number;
}): Promise<{ videos: Video[]; total: number }> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.category) query.append('category', params.category);
  if (params?.sort) query.append('sort', params.sort);
  if (params?.limit) query.append('limit', params.limit.toString());

  const res = await fetch(`${API_BASE}/videos?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch videos');
  return res.json();
}

export async function fetchVideoById(id: string): Promise<{
  video: Video;
  related: Video[];
  job?: TranscodeJob;
}> {
  const res = await fetch(`${API_BASE}/videos/${id}`);
  if (!res.ok) throw new Error('Failed to fetch video');
  return res.json();
}

export async function likeVideo(id: string, action: 'like' | 'dislike'): Promise<{ likes: number; dislikes: number }> {
  const res = await fetch(`${API_BASE}/videos/${id}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error('Failed to update reaction');
  return res.json();
}

export async function addComment(
  id: string,
  content: string,
  author: string = 'You'
): Promise<{ comment: any; totalComments: number }> {
  const res = await fetch(`${API_BASE}/videos/${id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, author }),
  });
  if (!res.ok) throw new Error('Failed to post comment');
  return res.json();
}

export async function uploadVideo(formData: FormData): Promise<{ video: Video; job: TranscodeJob }> {
  const res = await fetch(`${API_BASE}/videos/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(error.error || 'Failed to upload video');
  }
  return res.json();
}

export async function fetchJobStatus(id: string): Promise<{ job: TranscodeJob }> {
  const res = await fetch(`${API_BASE}/videos/${id}/job`);
  if (!res.ok) throw new Error('Failed to fetch job status');
  return res.json();
}

export async function fetchAnalytics(period: string = '30d'): Promise<AnalyticsData> {
  const res = await fetch(`${API_BASE}/analytics?period=${period}`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function fetchSettings(): Promise<{
  storage: StorageConfig;
  platform: any;
}> {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateSettings(config: Partial<StorageConfig>): Promise<{
  success: boolean;
  message: string;
  storage: StorageConfig;
}> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

export async function testStorageConnection(config: any): Promise<{
  success: boolean;
  message: string;
}> {
  const res = await fetch(`${API_BASE}/settings/test-storage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  return res.json();
}

export async function deleteVideo(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/videos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete video');
  return res.json();
}
