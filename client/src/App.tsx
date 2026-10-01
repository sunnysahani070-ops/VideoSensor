import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';

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
              <Route path="/studio" element={<StudioPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
};
