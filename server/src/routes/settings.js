import express from 'express';
import { storageConfig, updateStorageConfig, testR2Connection, getActiveStorageConfig } from '../services/storage.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Protect ALL settings routes with Admin Authentication
router.use(requireAuth);

router.get('/', (req, res) => {
  const active = getActiveStorageConfig();
  
  res.json({
    storage: {
      mode: active.mode,
      endpoint: active.endpoint,
      region: active.region,
      bucket: active.bucket,
      accessKeyId: active.accessKeyId ? `${active.accessKeyId.substring(0, 4)}...****` : '',
      publicBaseUrl: active.publicBaseUrl,
      forcePathStyle: active.forcePathStyle,
      isConfigured: Boolean(active.endpoint && active.bucket && active.accessKeyId),
    },
    platform: {
      name: 'VideoSensor',
      version: '1.0.0',
      description: 'High performance video streaming platform with adaptive HLS & Cloudflare R2 storage',
      hlsStreamingEnabled: true,
      monetizationEnabled: true,
      adsenseSlotId: 'ca-pub-992019284729104',
      storageUsedGB: 14.8,
      totalBandwidthGB: 342.1
    }
  });
});

router.post('/', (req, res) => {
  const { mode, endpoint, region, bucket, accessKeyId, secretAccessKey, publicBaseUrl, forcePathStyle } = req.body;

  const updated = updateStorageConfig({
    ...(mode && { mode }),
    ...(endpoint !== undefined && { endpoint }),
    ...(region !== undefined && { region }),
    ...(bucket !== undefined && { bucket }),
    ...(accessKeyId !== undefined && { accessKeyId }),
    ...(secretAccessKey !== undefined && { secretAccessKey }),
    ...(publicBaseUrl !== undefined && { publicBaseUrl }),
    ...(forcePathStyle !== undefined && { forcePathStyle }),
  });

  res.json({
    success: true,
    message: 'Storage settings updated successfully',
    storage: {
      mode: updated.mode,
      endpoint: updated.endpoint,
      bucket: updated.bucket,
      publicBaseUrl: updated.publicBaseUrl,
      isConfigured: Boolean(updated.endpoint && updated.bucket && updated.accessKeyId),
    }
  });
});

router.post('/test-storage', async (req, res) => {
  const active = getActiveStorageConfig();
  const configToTest = {
    endpoint: req.body.endpoint || active.endpoint,
    region: req.body.region || active.region,
    bucket: req.body.bucket || active.bucket,
    accessKeyId: req.body.accessKeyId || active.accessKeyId,
    secretAccessKey: req.body.secretAccessKey || active.secretAccessKey,
    forcePathStyle: req.body.forcePathStyle !== undefined ? req.body.forcePathStyle : active.forcePathStyle,
  };

  if (!configToTest.endpoint || !configToTest.bucket || !configToTest.accessKeyId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide endpoint, bucket name, and access key ID to test connection.'
    });
  }

  const result = await testR2Connection(configToTest);
  res.json(result);
});

export default router;
