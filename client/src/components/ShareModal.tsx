import React, { useState } from 'react';
import { X, Check, Copy, Code, Share2 } from 'lucide-react';
import { Video } from '../types';

interface ShareModalProps {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ video, isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'embed'>('link');

  if (!isOpen) return null;

  const currentUrl = `${window.location.origin}/watch/${video.id}`;
  const embedCode = `<iframe width="100%" height="480" src="${window.location.origin}/embed/${video.id}" title="${video.title.replace(/"/g, '&quot;')}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const socialLinks = [
    { name: 'X / Twitter', color: 'hover:bg-slate-800', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(video.title)}&url=${encodeURIComponent(currentUrl)}` },
    { name: 'WhatsApp', color: 'hover:bg-emerald-800/40', url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${video.title} ${currentUrl}`)}` },
    { name: 'Reddit', color: 'hover:bg-orange-800/40', url: `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(video.title)}` },
    { name: 'LinkedIn', color: 'hover:bg-blue-800/40', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div 
        className="w-full max-w-md rounded-2xl bg-surface-card border border-surface-border p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-brand-400" />
            <h3 className="font-semibold text-lg text-white">Share Video</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-surface-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-surface-darker p-1 mb-5 border border-surface-border">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'link' 
                ? 'bg-brand-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Direct Link
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'embed' 
                ? 'bg-brand-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Embed Player
          </button>
        </div>

        {activeTab === 'link' ? (
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Shareable Link</label>
            <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-surface-darker border border-surface-border mb-5">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full bg-transparent text-xs text-slate-200 outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium shrink-0 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="mb-2">
              <span className="text-xs font-medium text-slate-400 block mb-2">Share directly to:</span>
              <div className="grid grid-cols-2 gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`py-2 px-3 rounded-xl bg-surface-darker border border-surface-border text-xs text-slate-300 font-medium text-center transition-colors ${link.color}`}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-400">Embed Code (iFrame)</label>
              <span className="text-[10px] text-brand-400 flex items-center gap-1">
                <Code className="w-3 h-3" /> Responsive Player
              </span>
            </div>
            <textarea
              readOnly
              rows={4}
              value={embedCode}
              className="w-full bg-surface-darker text-xs font-mono text-slate-300 p-3 rounded-xl border border-surface-border outline-none resize-none mb-3"
            />
            <button
              onClick={handleCopyEmbed}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors"
            >
              {copiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedEmbed ? 'Embed Code Copied to Clipboard!' : 'Copy Embed Code'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
