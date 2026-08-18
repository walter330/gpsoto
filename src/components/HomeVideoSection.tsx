import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Play, Youtube, ExternalLink, X, Clock, Share2, Sparkles, Film } from 'lucide-react';
import { extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnail } from '../utils/embedUtils';
import { Post } from '../types';

export const HomeVideoSection: React.FC = () => {
  const { posts, categories, authors, setRoute } = useBlog();
  const [activeVideoModal, setActiveVideoModal] = useState<{ url: string; title: string } | null>(null);

  // Filter posts that have youtube_url or videos
  const videoPosts = posts.filter(p => p.status === 'published' && (p.youtube_url || p.has_video));

  // If none explicitly set, take hero or featured ones with sample fallback
  const displayPosts = videoPosts.length > 0 ? videoPosts : posts.filter(p => p.status === 'published').slice(0, 4);

  const mainVideoPost = displayPosts[0];
  const sideVideoPosts = displayPosts.slice(1, 4);

  if (!mainVideoPost) return null;

  const mainCat = categories.find(c => c.id === mainVideoPost.category_id);
  const mainYtUrl = mainVideoPost.youtube_url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const mainYtId = extractYouTubeId(mainYtUrl) || 'dQw4w9WgXcQ';
  const mainEmbedUrl = getYouTubeEmbedUrl(mainYtUrl);
  const mainThumb = getYouTubeThumbnail(mainYtUrl, 'max') || mainVideoPost.image;

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-800 space-y-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
            <Youtube size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                GPSoto en Video & YouTube
              </h2>
              <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-extrabold uppercase rounded-md tracking-wider">
                Audiovisual
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Reportajes especiales, análisis jurídicos en video y cobertura de contrataciones públicas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1.5 shadow-md shadow-red-600/20"
          >
            <Youtube size={14} />
            <span>Suscribirse al Canal</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Large Featured Video + Side Video Playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Main Big Video Player / Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 group shadow-2xl">
            <iframe
              src={mainEmbedUrl || ''}
              title={mainVideoPost.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span 
                className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase text-white"
                style={{ backgroundColor: mainCat?.color || '#1e40af' }}
              >
                {mainCat?.name || 'Video Exclusivo'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400 font-mono text-[11px]">HD 1080p • YouTube Oficial</span>
            </div>

            <h3 
              onClick={() => setRoute({ type: 'single', categorySlug: mainCat?.slug || 'general', postSlug: mainVideoPost.slug })}
              className="font-serif text-xl sm:text-2xl font-bold text-white hover:text-blue-400 transition-colors cursor-pointer leading-snug"
            >
              {mainVideoPost.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
              {mainVideoPost.excerpt}
            </p>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => setRoute({ type: 'single', categorySlug: mainCat?.slug || 'general', postSlug: mainVideoPost.slug })}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
              >
                Leer informe completo y notas asociadas →
              </button>
            </div>
          </div>
        </div>

        {/* Side Video Playlist (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Film size={14} className="text-red-500" />
              Más Videos & Análisis
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {displayPosts.length} reportajes
            </span>
          </div>

          <div className="divide-y divide-slate-800/80 space-y-3">
            {sideVideoPosts.map((vPost, idx) => {
              const vCat = categories.find(c => c.id === vPost.category_id);
              const vYtUrl = vPost.youtube_url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
              const vThumb = getYouTubeThumbnail(vYtUrl, 'hq') || vPost.image;

              return (
                <div
                  key={vPost.id}
                  className="pt-3 first:pt-0 group flex gap-3.5 items-start cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors"
                  onClick={() => {
                    if (vPost.youtube_url) {
                      setActiveVideoModal({ url: vPost.youtube_url, title: vPost.title });
                    } else {
                      setRoute({ type: 'single', categorySlug: vCat?.slug || 'general', postSlug: vPost.slug });
                    }
                  }}
                >
                  <div className="relative w-28 sm:w-32 aspect-video rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                    <img src={vThumb} alt={vPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                        <Play size={12} className="ml-0.5 fill-white" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block"
                    >
                      {vCat?.name || 'Actualidad'}
                    </span>
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                      {vPost.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Ver en YouTube ↗
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video Modal Popup */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl">
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800 text-white">
              <div className="flex items-center gap-2 truncate max-w-lg">
                <Youtube size={18} className="text-red-600 shrink-0" />
                <span className="font-bold text-sm truncate">{activeVideoModal.title}</span>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={getYouTubeEmbedUrl(activeVideoModal.url) || ''}
                title={activeVideoModal.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                autoPlay
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
