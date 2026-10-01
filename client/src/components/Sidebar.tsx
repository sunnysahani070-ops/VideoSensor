import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Compass,
  Flame,
  Film,
  Gamepad2,
  Cpu,
  Music2,
  TreePine,
  GraduationCap,
  Upload,
  BarChart3,
  Sliders,
  Clock,
  ThumbsUp,
  History,
  CloudCheck,
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { isAuthenticated } = useAuth();
  const primaryLinks = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Trending & Explore', icon: Flame, path: '/explore' },
  ];

  const creatorLinks = [
    { name: 'Creator Studio', icon: Upload, path: '/studio' },
    { name: 'Monetization Hub', icon: BarChart3, path: '/analytics' },
    { name: 'Storage & R2 Config', icon: Sliders, path: '/settings' },
  ];

  const categories = [
    { name: 'Gaming', icon: Gamepad2, query: 'Gaming' },
    { name: 'Tech & AI', icon: Cpu, query: 'Tech' },
    { name: 'Music & Audio', icon: Music2, query: 'Music' },
    { name: 'Films & Animation', icon: Film, query: 'Movies & Shows' },
    { name: 'Nature & Travel', icon: TreePine, query: 'Nature' },
    { name: 'Education & Code', icon: GraduationCap, query: 'Education' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-surface-darkest/95 backdrop-blur-md border-r border-surface-border p-4 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20 xl:w-64'
        }`}
      >
        <div className="space-y-6">
          {/* Primary Section */}
          <div className="space-y-1">
            {primaryLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-surface-card'
                  }`
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="lg:hidden xl:inline">{item.name}</span>
              </NavLink>
            ))}
          </div>

          <div className="h-[1px] bg-surface-border" />

          {/* Creator & Monetization Suite */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider lg:hidden xl:block">
              Creator Suite
            </div>
            <div className="space-y-1">
              {creatorLinks.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-surface-card'
                    }`
                  }
                >
                  <div className="flex items-center gap-3.5">
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="lg:hidden xl:inline">{item.name}</span>
                  </div>
                  {!isAuthenticated && (
                    <Lock className="w-3.5 h-3.5 text-slate-500 lg:hidden xl:block shrink-0" />
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-surface-border" />

          {/* Categories */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider lg:hidden xl:block">
              Explore Categories
            </div>
            <div className="space-y-1">
              {categories.map((cat) => (
                <NavLink
                  key={cat.name}
                  to={`/explore?category=${encodeURIComponent(cat.query)}`}
                  onClick={onCloseMobile}
                  className="flex items-center gap-3.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-surface-card transition-colors"
                >
                  <cat.icon className="w-4 h-4 shrink-0" />
                  <span className="lg:hidden xl:inline">{cat.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer & System Status */}
        <div className="pt-4 border-t border-surface-border space-y-3 lg:hidden xl:block">
          <div className="p-3 rounded-xl bg-surface-card/60 border border-surface-border">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Cloudflare R2
              </span>
              <span className="text-emerald-400 text-[10px]">Active</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Zero-egress adaptive HLS multi-bitrate delivery ready.</p>
          </div>

          <div className="text-[10px] text-slate-500 leading-relaxed px-1">
            <p>VideoSensor personal streaming engine.</p>
            <p className="mt-0.5">Built with Hovod HLS pipeline & React.</p>
          </div>
        </div>
      </aside>
    </>
  );
};
