import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  const { period = '30d' } = req.query;

  // Realistic generated analytics based on the platform's video catalog
  const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
  
  const dailyData = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const baseViews = 24000 + Math.floor(Math.sin(i * 0.8) * 8000) + Math.floor(Math.random() * 4000);
    const watchHours = Math.round(baseViews * 0.18);
    const revenue = parseFloat((baseViews * 0.0038).toFixed(2));
    const impressions = Math.round(baseViews * 1.6);

    dailyData.push({
      date: dateStr,
      views: baseViews,
      watchHours,
      revenue,
      impressions
    });
  }

  const totalViews = dailyData.reduce((acc, curr) => acc + curr.views, 0);
  const totalWatchHours = dailyData.reduce((acc, curr) => acc + curr.watchHours, 0);
  const totalRevenue = dailyData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalImpressions = dailyData.reduce((acc, curr) => acc + curr.impressions, 0);

  res.json({
    period,
    overview: {
      totalViews,
      totalWatchHours,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalImpressions,
      rpm: 3.82,
      cpm: 6.45,
      subscriberGrowth: 1420
    },
    chartData: dailyData,
    topVideos: [
      { id: 'vid-cyberpunk-future', title: 'Cyberpunk 2077: Phantom Liberty 4K Ray Tracing', views: 482190, revenue: 1832.40, avgDuration: '8:42' },
      { id: 'vid-ai-agents-2026', title: 'Building Autonomous Agentic AI Systems from Scratch', views: 129400, revenue: 491.70, avgDuration: '14:20' },
      { id: 'vid-deep-cosmos-4k', title: 'Cosmos Laundromat: Open Source Animated Film', views: 893120, revenue: 3393.80, avgDuration: '10:15' },
      { id: 'vid-synthwave-odyssey', title: 'Neon Horizon - 1-Hour Synthwave & Cyberpunk Mix', views: 3412000, revenue: 12965.60, avgDuration: '28:10' }
    ],
    adPerformance: [
      { format: 'Display Banners', revenue: parseFloat((totalRevenue * 0.42).toFixed(2)), share: '42%' },
      { format: 'In-Stream Video Ads', revenue: parseFloat((totalRevenue * 0.38).toFixed(2)), share: '38%' },
      { format: 'Sponsored Sidebar Cards', revenue: parseFloat((totalRevenue * 0.20).toFixed(2)), share: '20%' }
    ]
  });
});

export default router;
