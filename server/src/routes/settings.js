import express from 'express';
import { storageConfig, updateStorageConfig, testR2Connection } from '../services/storage.js';

const router = express.Router();

router.get('/', (req, res) => {
  // Return configuration masking secrets
  res.json({
    storage: {
      mode: storageConfig.mode,
      endpoint: storageConfig.endpoint,
      region: storageConfig.region,
      bucket: storageConfig.bucket,
      accessKeyId: storageConfig.accessKeyId ? `${storageConfig.accessKeyId.substring(0, 4)}...****` : '',
      publicBaseUrl: storageConfig.publicBaseUrl,
      forcePathStyle: storageConfig.forcePathStyle,
      isConfigured: Boolean(storageConfig.endpoint && storageConfig.bucket && storageConfig.accessKeyId),
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
  const configToTest = {
    endpoint: req.body.endpoint || storageConfig.endpoint,
    region: req.body.region || storageConfig.region,
    bucket: req.body.bucket || storageConfig.bucket,
    accessKeyId: req.body.accessKeyId || storageConfig.accessKeyId,
    secretAccessKey: req.body.secretAccessKey || storageConfig.secretAccessKey,
    forcePathStyle: req.body.forcePathStyle !== undefined ? req.body.forcePathStyle : storageConfig.forcePathStyle,
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
