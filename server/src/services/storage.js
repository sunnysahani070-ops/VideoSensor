import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

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

export function getS3Client() {
  if (!storageConfig.endpoint || !storageConfig.accessKeyId || !storageConfig.secretAccessKey) {
    return null;
  }
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: storageConfig.region || 'auto',
      endpoint: storageConfig.endpoint,
      credentials: {
        accessKeyId: storageConfig.accessKeyId,
        secretAccessKey: storageConfig.secretAccessKey,
      },
      forcePathStyle: storageConfig.forcePathStyle,
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
      forcePathStyle: config.forcePathStyle || false,
    });

    const command = new ListObjectsV2Command({
      Bucket: config.bucket,
      MaxKeys: 1,
    });

    const res = await client.send(command);
    return { success: true, message: 'Successfully connected to Cloudflare R2 / S3 bucket!' };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to authenticate with S3/R2 storage.' };
  }
}

export async function saveFile(file) {
  const client = getS3Client();
  
  if (storageConfig.mode === 'r2' && client && storageConfig.bucket) {
    // Upload to Cloudflare R2 / S3
    const key = `videos/${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const fileStream = fs.createReadStream(file.path);
    
    await client.send(new PutObjectCommand({
      Bucket: storageConfig.bucket,
      Key: key,
      Body: fileStream,
      ContentType: file.mimetype,
    }));

    // Cleanup local temp file
    try { fs.unlinkSync(file.path); } catch (e) {}

    const publicUrl = storageConfig.publicBaseUrl 
      ? `${storageConfig.publicBaseUrl.replace(/\/$/, '')}/${key}`
      : `${storageConfig.endpoint}/${storageConfig.bucket}/${key}`;

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
