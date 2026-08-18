import React, { useState } from 'react';
import { 
  X, 
  Youtube, 
  Linkedin, 
  Instagram, 
  Check, 
  Link2, 
  Sparkles,
  PlaySquare,
  Share2
} from 'lucide-react';
import { detectSocialPlatform, generateEmbedHtml, extractYouTubeId, getYouTubeThumbnail } from '../../utils/embedUtils';

interface SocialEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (embedHtml: string) => void;
}

export const SocialEmbedModal: React.FC<SocialEmbedModalProps> = ({ isOpen, onClose, onInsert }) => {
  const [activeTab, setActiveTab] = useState<'youtube' | 'x' | 'linkedin' | 'instagram' | 'tiktok'>('youtube');
  const [embedUrl, setEmbedUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [previewError, setPreviewError] = useState(false);

  if (!isOpen) return null;

  const handleSelectTab = (tab: 'youtube' | 'x' | 'linkedin' | 'instagram' | 'tiktok') => {
    setActiveTab(tab);
    setEmbedUrl('');
    setCaption('');
    setPreviewError(false);
  };

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!embedUrl.trim()) return;

    const html = generateEmbedHtml(embedUrl.trim(), caption.trim());
    onInsert(html);
    onClose();
    setEmbedUrl('');
    setCaption('');
  };

  const detected = detectSocialPlatform(embedUrl);

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'youtube':
        return 'https://www.youtube.com/watch?v=... o https://youtu.be/...';
      case 'x':
        return 'https://x.com/usuario/status/12345...';
      case 'linkedin':
        return 'https://www.linkedin.com/posts/...';
      case 'instagram':
        return 'https://www.instagram.com/p/... o https://www.instagram.com/reel/...';
      case 'tiktok':
        return 'https://www.tiktok.com/@usuario/video/...';
    }
  };

  const ytId = activeTab === 'youtube' ? extractYouTubeId(embedUrl) : null;
  const ytThumb = ytId ? getYouTubeThumbnail(ytId, 'hq') : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#2271b1] flex items-center justify-center text-white font-bold text-xs">
              <Share2 size={14} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Insertar Video o Red Social Embebida</h3>
              <p className="text-[11px] text-slate-400">YouTube, 𝕏 (Twitter), LinkedIn, Instagram y TikTok</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="p-2 bg-slate-100 border-b border-slate-200 flex items-center gap-1 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => handleSelectTab('youtube')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'youtube'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <Youtube size={14} />
            YouTube
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('x')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'x'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <span className="font-mono text-sm leading-none">𝕏</span>
            𝕏 (Twitter)
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('linkedin')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'linkedin'
                ? 'bg-[#0a66c2] text-white shadow-xs'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <Linkedin size={14} />
            LinkedIn
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('instagram')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'instagram'
                ? 'bg-gradient-to-r from-[#bc1888] to-[#cc2366] text-white shadow-xs'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <Instagram size={14} />
            Instagram
          </button>

          <button
            type="button"
            onClick={() => handleSelectTab('tiktok')}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'tiktok'
                ? 'bg-slate-900 text-cyan-400 border border-cyan-500/50 shadow-xs'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <span className="font-bold">🎵</span>
            TikTok
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleInsert} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>URL del enlace a embeber <span className="text-red-500">*</span></span>
              {embedUrl && (
                <span className="text-[10px] text-[#2271b1] lowercase font-mono">
                  Detectado: {detected !== 'unknown' ? detected : 'enlace web'}
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="url"
                value={embedUrl}
                onChange={e => setEmbedUrl(e.target.value)}
                placeholder={getPlaceholder()}
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-[#2271b1] focus:bg-white font-mono"
              />
              <Link2 size={15} className="absolute left-3 top-3 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Pie de foto o Descripción editorial (Opcional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Ej. Declaración oficial transmitida en vivo / Análisis publicado en redes..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#2271b1] focus:bg-white"
            />
          </div>

          {/* Quick presets helper */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1">
            <span className="font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#1e40af]" />
              Generación de bloque 100% responsive:
            </span>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              El bloque se adaptará con proporciones automáticas para móviles y ordenadores, optimizado para indexación en Google News y Core Web Vitals.
            </p>
          </div>

          {/* YouTube Live Preview if available */}
          {activeTab === 'youtube' && ytThumb && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <img src={ytThumb} alt="Miniatura YouTube" className="w-20 h-12 object-cover rounded-lg border border-slate-300 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block line-clamp-1">Video detectado correctamente</span>
                <span className="text-[11px] text-slate-500 font-mono">ID: {ytId}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!embedUrl.trim()}
              className="px-5 py-2 bg-[#2271b1] hover:bg-[#135e96] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Check size={14} />
              Insertar Embebido en Nota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
