import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// In-memory or env-loaded storage configuration
export let storageConfig = {
  mode: process.env.STORAGE_MODE || 'local', // 'local' or 'r2'
  endpoint: process.env.S3_ENDPOINT || '',
  region: process.env.S3_REGION || 'auto',
  bucket: process.env.S3_BUCKET || '',
  accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  publicBaseUrl: process.env.S3_PUBLIC_BASE_URL || '',
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
};

let s3ClientInstance = null;

export function getActiveStorageConfig() {
  return {
    mode: storageConfig.mode || process.env.STORAGE_MODE || 'local',
    endpoint: storageConfig.endpoint || process.env.S3_ENDPOINT || '',
    region: storageConfig.region || process.env.S3_REGION || 'auto',
    bucket: storageConfig.bucket || process.env.S3_BUCKET || '',
    accessKeyId: storageConfig.accessKeyId || process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: storageConfig.secretAccessKey || process.env.S3_SECRET_ACCESS_KEY || '',
    publicBaseUrl: storageConfig.publicBaseUrl || process.env.S3_PUBLIC_BASE_URL || '',
    forcePathStyle: storageConfig.forcePathStyle !== undefined ? storageConfig.forcePathStyle : (process.env.S3_FORCE_PATH_STYLE === 'true'),
  };
}

export function getS3Client() {
  const conf = getActiveStorageConfig();
  if (!conf.endpoint || !conf.accessKeyId || !conf.secretAccessKey) {
    return null;
  }
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: conf.region || 'auto',
      endpoint: conf.endpoint,
      credentials: {
        accessKeyId: conf.accessKeyId,
        secretAccessKey: conf.secretAccessKey,
      },
      forcePathStyle: conf.forcePathStyle,
    });
  }
  return s3ClientInstance;
}

export function updateStorageConfig(newConfig) {
  storageConfig = { ...storageConfig, ...newConfig };
  s3ClientInstance = null; // reset client instance
  return storageConfig;
}

export async function testR2Connection(config) {
  try {
    const client = new S3Client({
      region: config.region || 'auto',
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: config.forcePathStyle !== undefined ? config.forcePathStyle : true,
    });

    const command = new ListObjectsV2Command({
      Bucket: config.bucket,
      MaxKeys: 1,
    });

    const res = await client.send(command);
    return { success: true, message: 'Successfully connected to cloud storage bucket!' };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to authenticate with cloud storage.' };
  }
}

export async function saveFile(file) {
  const conf = getActiveStorageConfig();
  const client = getS3Client();

  if (conf.mode === 'r2' && client && conf.bucket) {
    // Upload to Cloud Object Storage (S3 / Cloudflare R2)
    const key = `videos/${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const fileStream = fs.createReadStream(file.path);

    await client.send(new PutObjectCommand({
      Bucket: conf.bucket,
      Key: key,
      Body: fileStream,
      ContentType: file.mimetype || 'video/mp4',
    }));

    // Cleanup local temp file
    try { fs.unlinkSync(file.path); } catch (e) {}

    const publicUrl = conf.publicBaseUrl 
      ? `${conf.publicBaseUrl.replace(/\/$/, '')}/${key}`
      : `${conf.endpoint.replace(/\/$/, '')}/${conf.bucket}/${key}`;

    console.log(`☁️ Video saved to cloud object storage: ${publicUrl}`);

    return {
      storage: 'r2',
      key,
      url: publicUrl,
    };
  }

  // Fallback to local storage
  const filename = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const destPath = path.join(UPLOADS_DIR, filename);
  fs.copyFileSync(file.path, destPath);
  try { fs.unlinkSync(file.path); } catch (e) {}

  return {
    storage: 'local',
    filename,
    url: `/uploads/${filename}`,
  };
}
