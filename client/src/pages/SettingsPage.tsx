import React, { useEffect, useState } from 'react';
import {
  HardDrive,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Save,
  Radio,
  Server,
  Terminal,
  Cpu,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { StorageConfig } from '../types';
import { fetchSettings, updateSettings, testStorageConnection } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [mode, setMode] = useState<'local' | 'r2'>('local');
  const [endpoint, setEndpoint] = useState('');
  const [region, setRegion] = useState('auto');
  const [bucket, setBucket] = useState('');
  const [accessKeyId, setAccessKeyId] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [publicBaseUrl, setPublicBaseUrl] = useState('');
  const [forcePathStyle, setForcePathStyle] = useState(true);

  const [platformStats, setPlatformStats] = useState<any>({
    storageUsedGB: 14.8,
    totalBandwidthGB: 342.1,
    hlsStreamingEnabled: true,
  });

  useEffect(() => {
    fetchSettings()
      .then((res) => {
        const s = res.storage;
        setMode(s.mode || 'local');
        setEndpoint(s.endpoint || '');
        setRegion(s.region || 'auto');
        setBucket(s.bucket || '');
        setAccessKeyId(s.accessKeyId || '');
        setPublicBaseUrl(s.publicBaseUrl || '');
        setForcePathStyle(s.forcePathStyle ?? true);
        if (res.platform) setPlatformStats(res.platform);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testStorageConnection({
        endpoint,
        region,
        bucket,
        accessKeyId,
        secretAccessKey,
        forcePathStyle,
      });
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      await updateSettings({
        mode,
        endpoint,
        region,
        bucket,
        accessKeyId,
        secretAccessKey: secretAccessKey || undefined,
        publicBaseUrl,
        forcePathStyle,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="pb-6 border-b border-surface-border">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
          <Cloud className="w-3.5 h-3.5" />
          <span>Cloudflare R2 Object Storage Infrastructure</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Storage & Platform Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure S3-compatible credentials for Cloudflare R2, MinIO, or local disk streaming as outlined in the VideoSensor architecture blueprint.
        </p>
      </div>

      {/* Storage Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border">
          <span className="text-xs text-slate-400 block mb-1">Active Storage Mode</span>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${mode === 'r2' ? 'bg-cyan-400' : 'bg-brand-400'} animate-pulse`} />
            <span className="text-lg font-bold text-white uppercase tracking-wider font-mono">
              {mode === 'r2' ? 'Cloudflare R2' : 'Local Disk'}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border">
          <span className="text-xs text-slate-400 block mb-1">Total Transcoded Assets</span>
          <div className="text-lg font-bold text-white font-mono">
            {platformStats.storageUsedGB} GB
          </div>
          <span className="text-[11px] text-slate-500">HLS multi-bitrate chunks</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface-card border border-surface-border">
          <span className="text-xs text-slate-400 block mb-1">Global Edge Delivery</span>
          <div className="text-lg font-bold text-emerald-400 font-mono">
            {platformStats.totalBandwidthGB} GB
          </div>
          <span className="text-[11px] text-emerald-500/80">Zero egress fee enabled</span>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="rounded-3xl bg-surface-card border border-surface-border p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div>
            <h3 className="text-lg font-bold font-display text-white">Storage Backend</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Switch between local development storage and high-speed Cloudflare R2 cloud object storage.
            </p>
          </div>
          <div className="flex rounded-xl bg-surface-darker p-1 border border-surface-border">
            <button
              type="button"
              onClick={() => setMode('local')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'local' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Local Storage
            </button>
            <button
              type="button"
              onClick={() => setMode('r2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'r2' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cloudflare R2
            </button>
          </div>
        </div>

        {mode === 'r2' && (
          <div className="space-y-4 pt-2">
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-300 leading-relaxed">
              Cloudflare R2 provides S3-compatible APIs with <strong>$0 egress bandwidth fees</strong>, making it the most cost-effective solution for video delivery and HLS stream playback.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  S3 Endpoint (Cloudflare R2)
                </label>
                <input
                  type="text"
                  placeholder="https://<account_id>.r2.cloudflarestorage.com"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="w-full bg-surface-darker border border-surface-border focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  R2 Bucket Name
                </label>
                <input
                  type="text"
                  placeholder="videosensor-streams"
                  value={bucket}
                  onChange={(e) => setBucket(e.target.value)}
                  className="w-full bg-surface-darker border border-surface-border focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Access Key ID
                </label>
                <input
                  type="text"
                  placeholder="Cloudflare R2 Token Access Key"
                  value={accessKeyId}
                  onChange={(e) => setAccessKeyId(e.target.value)}
                  className="w-full bg-surface-darker border border-surface-border focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Secret Access Key
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••"
                  value={secretAccessKey}
                  onChange={(e) => setSecretAccessKey(e.target.value)}
                  className="w-full bg-surface-darker border border-surface-border focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Public CDN Domain (Custom CNAME)
                </label>
                <input
                  type="text"
                  placeholder="https://cdn.videosensor.com"
                  value={publicBaseUrl}
                  onChange={(e) => setPublicBaseUrl(e.target.value)}
                  className="w-full bg-surface-darker border border-surface-border focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  S3 Region
                </label>
                <input
                  type="text"
                  placeholder="auto"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-surface-darker border border-surface-border focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
              testResult.success
                ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        {/* Actions Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-surface-border">
          {mode === 'r2' ? (
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface-dark hover:bg-surface-card border border-surface-border text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing R2 Credentials...' : 'Test Storage Connection'}</span>
            </button>
          ) : <div />}

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>

      {/* Production VPS & Docker Deployment Reference Box */}
      <div className="rounded-2xl bg-surface-card border border-surface-border p-6 space-y-4 text-xs">
        <div className="flex items-center gap-2 text-white font-display font-bold text-base">
          <Terminal className="w-4 h-4 text-brand-400" />
          <span>Production Docker & VPS Quickstart</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          To run VideoSensor in production on a Docker-capable VPS (Ubuntu / Debian / AlmaLinux):
        </p>
        <div className="p-4 rounded-xl bg-surface-darkest font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto border border-surface-border">
          <p className="text-slate-500"># 1. Clone repository</p>
          <p>git clone https://github.com/sunnysahani070-ops/VideoSensor.git</p>
          <p>cd VideoSensor</p>
          <p className="text-slate-500 pt-1"># 2. Configure .env with Cloudflare R2 credentials</p>
          <p>cp .env.example .env</p>
          <p className="text-slate-500 pt-1"># 3. Launch full stack (API, Frontend, Transcoder)</p>
          <p className="text-brand-300">docker compose -f docker-compose.prod.yml up -d --build</p>
        </div>
      </div>
    </div>
  );
};
