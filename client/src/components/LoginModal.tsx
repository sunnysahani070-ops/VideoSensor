import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, KeyRound, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginAdmin } from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@videosensor.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginAdmin(email, password);
      login(data.token, data.user);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-md rounded-3xl bg-surface-card border border-surface-border p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white font-display">Administrator Sign In</h3>
              <p className="text-[11px] text-slate-400">Unlock Studio, Analytics, and Cloudflare R2 storage</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-surface-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Admin Email</label>
            <input
              type="email"
              required
              placeholder="admin@videosensor.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-darker border border-surface-border focus:border-brand-500 rounded-xl px-4 py-2.5 text-slate-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Admin Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-darker border border-surface-border focus:border-brand-500 rounded-xl px-4 py-2.5 text-slate-100 outline-none transition-all font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
          </button>
        </form>

        {/* Demo Credentials Tip */}
        <div className="mt-5 p-3 rounded-xl bg-surface-darker/60 border border-surface-border text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Default Administrator Credentials:</span>
          </div>
          <div className="font-mono text-slate-300 pl-5">
            Email: <span className="text-brand-300">admin@videosensor.com</span>
            <br />
            Password: <span className="text-brand-300">admin123</span>
          </div>
          <p className="text-[10px] text-slate-500 pt-1 pl-5">
            Change anytime via <code className="text-slate-400 font-mono">ADMIN_EMAIL</code> and <code className="text-slate-400 font-mono">ADMIN_PASSWORD</code> in your environment variables.
          </p>
        </div>
      </div>
    </div>
  );
};
