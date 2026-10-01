import React, { useState } from 'react';
import { ShieldAlert, Lock, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginAdmin } from '../services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  title = "Administrator Access Required",
  description = "You must be signed in with administrator credentials to view or modify storage settings, video ingestion pipelines, and revenue analytics."
}) => {
  const { isAuthenticated, loading, login } = useAuth();
  const [email, setEmail] = useState('admin@videosensor.com');
  const [password, setPassword] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Verifying administrator authorization...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const data = await loginAdmin(email, password);
      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="rounded-3xl bg-surface-card border border-surface-border p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto shadow-glow">
          <Lock className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold font-display text-white">{title}</h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{description}</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3 text-left text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-darker border border-surface-border focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Admin Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-darker border border-surface-border focus:border-brand-500 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold shadow-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In as Administrator'}</span>
          </button>
        </form>

        <div className="p-3 rounded-xl bg-surface-darker/60 border border-surface-border text-[11px] text-slate-400 text-left space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Default Administrator Credentials:</span>
          </div>
          <div className="font-mono text-slate-300 pl-5">
            Email: <span className="text-brand-300">admin@videosensor.com</span>
            <br />
            Password: <span className="text-brand-300">admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
};
