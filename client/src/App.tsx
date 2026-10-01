import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { WatchPage } from './pages/WatchPage';
import { ExplorePage } from './pages/ExplorePage';
import { StudioPage } from './pages/StudioPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { EmbedPlayerPage } from './pages/EmbedPlayerPage';

export const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isEmbed = location.pathname.startsWith('/embed');

  if (isEmbed) {
    return (
      <Routes>
        <Route path="/embed/:id" element={<EmbedPlayerPage />} />
      </Routes>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-surface-darkest flex flex-col text-slate-100">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex flex-1">
          <Sidebar
            isOpen={sidebarOpen}
            onCloseMobile={() => setSidebarOpen(false)}
          />

          <main className="flex-1 min-w-0 px-3 sm:px-6 lg:px-8 pt-6 flex flex-col justify-between">
            <div>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/watch/:id" element={<WatchPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                
                {/* Protected Admin & Creator Routes */}
                <Route
                  path="/studio"
                  element={
                    <ProtectedRoute title="Creator Studio Access" description="Sign in as administrator to upload videos, configure HLS bitrate ladders, and manage video streams.">
                      <StudioPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute title="Creator Monetization Hub Access" description="Sign in as administrator to inspect revenue metrics, ad impressions, and CPM analytics.">
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute title="Cloudflare R2 & Platform Settings Access" description="Sign in as administrator to view or update cloud object storage buckets, S3 API keys, and CDN endpoints.">
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>

            <Footer />
          </main>
        </div>
      </div>
    </AuthProvider>
  );
};
