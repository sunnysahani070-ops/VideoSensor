import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  Eye,
  Clock,
  TrendingUp,
  BarChart2,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { AnalyticsData } from '../types';
import { fetchAnalytics } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [metricTab, setMetricTab] = useState<'revenue' | 'views'>('revenue');

  useEffect(() => {
    setLoading(true);
    fetchAnalytics(period)
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Monetization & AdSense Ready</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Creator Monetization & Audience Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time tracking of impressions, player sessions, ad earnings, and content reach.
          </p>
        </div>

        {/* Time period selector */}
        <div className="flex rounded-xl bg-surface-card border border-surface-border p-1 self-start sm:self-auto">
          {['7d', '30d', '90d'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                period === p
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading || !data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-surface-card border border-surface-border" />
          ))}
        </div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue */}
            <div className="rounded-2xl bg-gradient-to-br from-surface-card via-surface-card to-emerald-950/20 border border-emerald-500/30 p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Estimated Ad Revenue</span>
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-white">
                ${data.overview.totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18.4% vs previous period</span>
              </div>
            </div>

            {/* Total Views */}
            <div className="rounded-2xl bg-surface-card border border-surface-border p-5 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Total Stream Views</span>
                <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400">
                  <Eye className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-white">
                {data.overview.totalViews.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-brand-400 font-semibold mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.6% view velocity</span>
              </div>
            </div>

            {/* Watch Hours */}
            <div className="rounded-2xl bg-surface-card border border-surface-border p-5 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Watch Time</span>
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-white">
                {data.overview.totalWatchHours.toLocaleString()} <span className="text-base text-slate-400 font-normal">hrs</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2 font-mono">
                <span>Average 6.8 mins / view</span>
              </div>
            </div>

            {/* RPM / CPM */}
            <div className="rounded-2xl bg-surface-card border border-surface-border p-5 shadow-lg">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>RPM / CPM</span>
                <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <BarChart2 className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold font-display text-white">
                  ${data.overview.rpm}
                </span>
                <span className="text-xs text-slate-400">RPM</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-mono mt-2">
                <span>Platform CPM: ${data.overview.cpm}</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Section */}
          <div className="rounded-3xl bg-surface-card border border-surface-border p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  Performance Growth Over Time
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Daily aggregated stream metrics for selected timeframe ({period}).
                </p>
              </div>

              {/* Metric switcher */}
              <div className="flex rounded-xl bg-surface-darker p-1 border border-surface-border self-start sm:self-auto">
                <button
                  onClick={() => setMetricTab('revenue')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    metricTab === 'revenue'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Revenue ($)
                </button>
                <button
                  onClick={() => setMetricTab('views')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    metricTab === 'views'
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Views
                </button>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161926',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                  />
                  {metricTab === 'revenue' ? (
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#revenueGrad)"
                      name="Ad Revenue ($)"
                    />
                  ) : (
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#viewsGrad)"
                      name="Total Views"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ad Breakdown & Compliance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Ad Format Breakdown */}
            <div className="lg:col-span-6 rounded-2xl bg-surface-card border border-surface-border p-6 space-y-4">
              <h3 className="font-bold text-base font-display text-white">
                Ad Revenue by Placement
              </h3>
              <p className="text-xs text-slate-400">
                Monetization distribution across video stream components.
              </p>

              <div className="space-y-3 pt-2">
                {data.adPerformance.map((ad, i) => (
                  <div key={i} className="p-3 rounded-xl bg-surface-darker border border-surface-border flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block">{ad.format}</span>
                      <span className="text-[11px] text-slate-400">{ad.share} of total earnings</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      ${ad.revenue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AdSense & Rights Readiness Box (Plan Section 24 & 25) */}
            <div className="lg:col-span-6 rounded-2xl bg-surface-card border border-surface-border p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base font-display text-white">
                  Content Rights & AdSense Policy
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                As detailed in the VideoSensor architecture plan, monetization approval requires adhering to original content and explicit distribution rights.
              </p>

              <div className="space-y-2.5 pt-1 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Only original or verified licensed video files distributed</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No copyrighted broadcast or unpermitted audio stems</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Responsive ads aligned with player viewports</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-darker border border-surface-border mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Payout Threshold ($100.00)</span>
                  <span className="font-semibold text-emerald-400">Threshold Met</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-dark overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Streams Table */}
          <div className="rounded-2xl bg-surface-card border border-surface-border p-6 space-y-4">
            <h3 className="font-bold text-base font-display text-white">
              Top Performing Monetized Streams
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-darker text-slate-400 uppercase tracking-wider text-[10px] border-b border-surface-border">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Views</th>
                    <th className="py-3 px-4">Avg Watch Duration</th>
                    <th className="py-3 px-4 text-right">Ad Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border text-slate-300">
                  {data.topVideos.map((tv) => (
                    <tr key={tv.id} className="hover:bg-surface-dark/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">{tv.title}</td>
                      <td className="py-3 px-4 font-mono">{tv.views.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono">{tv.avgDuration}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                        ${tv.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
