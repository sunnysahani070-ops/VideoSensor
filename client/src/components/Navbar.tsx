import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Upload,
  Bell,
  Menu,
  X,
  Sparkles,
  Cloud,
  DollarSign,
  User,
  Sliders,
  BarChart3,
  Video as VideoIcon,
  LogIn,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LoginModal } from './LoginModal';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-surface-darkest/90 backdrop-blur-md border-b border-surface-border px-3 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Hamburger & Logo */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-card transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-[1px] shadow-glow">
            <div className="w-full h-full bg-surface-darkest rounded-[11px] flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-brand-400 group-hover:scale-110 transition-transform" />
                <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
              VideoSensor
            </span>
            <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase -mt-1 font-semibold">
              HLS • Cloudflare R2
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl mx-2 sm:mx-6 hidden sm:block">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            placeholder="Search videos, creators, topics, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-10 rounded-full bg-surface-card border border-surface-border focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-xs sm:text-sm text-slate-100 placeholder-slate-400 transition-all outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Right: Actions & User Hub */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* R2 Cloud Storage Badge */}
        <Link
          to="/settings"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface-card border border-surface-border text-xs text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
          title="Cloudflare R2 & Object Storage Configuration"
        >
          <Cloud className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-[11px]">R2 Ready</span>
        </Link>

        {/* Monetization RPM Badge */}
        <Link
          to="/analytics"
          className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-900/30 transition-colors"
          title="Creator Monetization & RPM Analytics"
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px]">RPM $3.82</span>
        </Link>

        {/* Upload / Studio Button */}
        <Link
          to="/studio"
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-glow transition-all transform hover:scale-[1.02]"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden xs:inline">Upload</span>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-card transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-dropdown p-4 text-xs z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-3">
                <span className="font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-brand-400">Mark all as read</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-card/60">
                  <div className="w-2 h-2 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-slate-200 font-medium">HLS Transcoding Completed</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">Your video "Cyberpunk 2077 Benchmark" has been distributed across Cloudflare R2 edge.</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">10 mins ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-surface-card/60">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-slate-200 font-medium">AdSense Revenue Updated</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">New daily ad impressions reached 58,400 across your player views.</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Admin Authentication */}
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-full border border-surface-border hover:border-brand-500 transition-colors"
            >
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-dropdown p-2 text-xs z-50 animate-in fade-in zoom-in-95">
                <div className="p-3 border-b border-surface-border mb-1">
                  <p className="font-semibold text-white">{user?.name || 'Administrator'}</p>
                  <p className="text-slate-400 text-[11px] truncate">{user?.email}</p>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 text-[10px] font-semibold mt-1">
                    <ShieldCheck className="w-3 h-3 text-brand-400" />
                    Admin
                  </span>
                </div>

                <Link
                  to="/studio"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/10 text-slate-200 transition-colors"
                >
                  <VideoIcon className="w-4 h-4 text-brand-400" />
                  <span>Video Studio & Uploads</span>
                </Link>

                <Link
                  to="/analytics"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/10 text-slate-200 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>Monetization & Analytics</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/10 text-slate-200 transition-colors"
                >
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Storage & Platform Settings</span>
                </Link>

                <div className="h-[1px] bg-surface-border my-1" />

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-rose-500/10 text-rose-400 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-card border border-surface-border hover:border-brand-500 text-slate-200 hover:text-white text-xs font-medium transition-colors"
          >
            <LogIn className="w-4 h-4 text-brand-400" />
            <span>Sign In</span>
          </button>
        )}
      </div>

      {/* Admin Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
};
