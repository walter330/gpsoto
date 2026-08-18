import React, { useEffect, useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { 
  Clock, 
  Share2, 
  Copy, 
  Check, 
  ChevronRight, 
  Bookmark, 
  ArrowLeft, 
  Twitter, 
  Linkedin, 
  Facebook, 
  MessageCircle,
  Play,
  Youtube,
  Image as ImageIcon,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { getYouTubeEmbedUrl, extractYouTubeId } from '../utils/embedUtils';

export const SingleArticleView: React.FC<{ categorySlug: string; postSlug: string }> = ({
  categorySlug,
  postSlug
}) => {
  const { posts, categories, authors, setRoute, incrementViews } = useBlog();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [mediaTab, setMediaTab] = useState<'image' | 'video'>('video');

  const post = posts.find(p => p.slug === postSlug);

  useEffect(() => {
    if (post) {
      incrementViews(post.id);
      if (post.youtube_url) {
        setMediaTab('video');
      } else {
        setMediaTab('image');
      }
    }
  }, [postSlug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#111111] mb-2">Artículo no encontrado</h2>
        <p className="text-[#888888] mb-6">El contenido que buscas ha sido modificado o eliminado.</p>
        <button
          onClick={() => setRoute({ type: 'home' })}
          className="px-6 py-2.5 bg-[#2d5a27] hover:bg-[#23491f] text-white text-xs font-bold rounded-lg transition-colors"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  const category = categories.find(c => c.id === post.category_id) || categories[0];
  const author = authors.find(a => a.id === post.author_id) || authors[0];
  const relatedPosts = posts
    .filter(p => p.category_id === post.category_id && p.id !== post.id && p.status === 'published')
    .slice(0, 3);
  const popularPosts = posts.filter(p => p.id !== post.id && p.status === 'published').slice(0, 4);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min de lectura`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const articleUrl = encodeURIComponent(window.location.href);
  const articleTitle = encodeURIComponent(post.title);

  return (
    <div className="relative">
      {/* 1. Live Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-[#2d5a27] z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-[#888888] mb-6 overflow-x-auto whitespace-nowrap">
          <button onClick={() => setRoute({ type: 'home' })} className="hover:text-[#111111]">
            Portada
          </button>
          <ChevronRight size={12} className="text-[#888888]/40 shrink-0" />
          <button
            onClick={() => setRoute({ type: 'category', slug: category.slug, page: 1 })}
            className="hover:text-[#111111] font-bold text-[#2d5a27]"
          >
            {category.name}
          </button>
          <ChevronRight size={12} className="text-[#888888]/40 shrink-0" />
          <span className="text-[#111111] truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Article Layout Grid (Main 8 Cols + Sidebar 4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Article Column (8 Cols) */}
          <article className="lg:col-span-8 space-y-8">
            {/* Header / Title Area */}
            <div className="space-y-4">
              <button
                onClick={() => setRoute({ type: 'category', slug: category.slug, page: 1 })}
                className="inline-block text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm bg-[#2d5a27]"
              >
                {category.name}
              </button>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#111111] leading-tight tracking-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-lg sm:text-xl text-[#111111]/70 font-normal leading-relaxed pt-1 border-b border-[#e8e8e8] pb-6">
                  {post.excerpt}
                </p>
              )}

              {/* Author Info Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-12 h-12 rounded-full object-cover shadow-sm cursor-pointer border border-[#e8e8e8]"
                    onClick={() => setRoute({ type: 'author', slug: author.slug })}
                  />
                  <div>
                    <button
                      onClick={() => setRoute({ type: 'author', slug: author.slug })}
                      className="font-bold text-sm text-[#111111] hover:text-[#2d5a27] block text-left"
                    >
                      {author.name}
                    </button>
                    <span className="text-xs text-[#888888] block">{author.role_title}</span>
                  </div>
                </div>

                <div className="text-right text-xs text-[#888888] space-y-1">
                  <div>Publicado: <span className="font-semibold text-[#111111]">{formatDate(post.published_at)}</span></div>
                  <div className="flex items-center justify-end gap-1 text-[#888888]">
                    <Clock size={12} />
                    <span>{getReadingTime(post.content)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Share Bar */}
            <div className="flex items-center justify-between p-3.5 bg-[#f7f7f7] border border-[#e8e8e8] rounded-2xl">
              <span className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                <Share2 size={14} className="text-[#2d5a27]" />
                Compartir artículo:
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${articleTitle}%20${articleUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white hover:bg-emerald-600 hover:text-white text-[#111111] rounded-lg border border-[#e8e8e8] transition-colors"
                  title="Compartir por WhatsApp"
                >
                  <MessageCircle size={15} />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${articleTitle}&url=${articleUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white hover:bg-[#111111] hover:text-white text-[#111111] rounded-lg border border-[#e8e8e8] transition-colors"
                  title="Compartir en X / Twitter"
                >
                  <Twitter size={15} />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${articleUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white hover:bg-[#2d5a27] hover:text-white text-[#111111] rounded-lg border border-[#e8e8e8] transition-colors"
                  title="Compartir en LinkedIn"
                >
                  <Linkedin size={15} />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white hover:bg-blue-600 hover:text-white text-[#111111] rounded-lg border border-[#e8e8e8] transition-colors"
                  title="Compartir en Facebook"
                >
                  <Facebook size={15} />
                </a>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 px-3 py-2 bg-white hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-bold rounded-lg border border-[#e8e8e8] transition-colors"
                  title="Copiar enlace directo"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Featured Media (YouTube Video & Featured Image) */}
            <div className="space-y-3">
              {post.youtube_url && (
                <div className="flex items-center justify-between p-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setMediaTab('video')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                        mediaTab === 'video'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-white'
                      }`}
                    >
                      <Youtube size={14} />
                      <span>Video YouTube</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaTab('image')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                        mediaTab === 'image'
                          ? 'bg-[#1e40af] text-white shadow-xs'
                          : 'text-slate-700 hover:bg-white'
                      }`}
                    >
                      <ImageIcon size={14} />
                      <span>Fotografía Principal</span>
                    </button>
                  </div>

                  <a
                    href={post.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-red-600 hover:underline flex items-center gap-1 font-semibold pr-2"
                  >
                    <span>Abrir en YouTube</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* Video Player Display */}
              {post.youtube_url && mediaTab === 'video' ? (
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg border border-slate-300">
                    <iframe
                      src={getYouTubeEmbedUrl(post.youtube_url) || ''}
                      title={post.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-xs text-slate-500 italic px-2 flex items-center gap-1.5">
                    <Youtube size={13} className="text-red-600" />
                    <span>Reportaje Audiovisual oficial publicado en el canal de YouTube de GPSoto.</span>
                  </p>
                </div>
              ) : (
                /* Static Image Display */
                <div className="space-y-2">
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#f7f7f7] shadow-sm border border-[#e8e8e8]">
                    <img
                      src={post.image}
                      alt={post.image_alt || post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {post.image_alt && (
                    <p className="text-xs text-[#888888] italic px-2">
                      Foto: {post.image_alt}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Main Editorial Body Typography */}
            <div
              className="prose max-w-none text-[#2b2b2b] text-[17.5px] leading-[1.85] space-y-6 font-sans"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Author Biography Box */}
            <div className="bg-[#f7f7f7] border border-[#e8e8e8] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-20 h-20 rounded-full object-cover shrink-0 shadow-sm border border-[#e8e8e8]"
              />
              <div className="space-y-2 flex-1">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#2d5a27]">
                  Sobre el autor
                </span>
                <h3 className="font-serif text-xl font-bold text-[#111111]">
                  {author.name}
                </h3>
                <p className="text-xs font-semibold text-[#888888]">{author.role_title}</p>
                <p className="text-sm text-[#111111]/70 leading-relaxed pt-1">
                  {author.bio}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setRoute({ type: 'author', slug: author.slug })}
                    className="text-xs font-bold text-[#2d5a27] hover:underline inline-flex items-center gap-1"
                  >
                    Ver todos los artículos de {author.name} →
                  </button>
                </div>
              </div>
            </div>

            {/* Related Articles Strip */}
            {relatedPosts.length > 0 && (
              <div className="border-t border-[#e8e8e8] pt-10 space-y-6">
                <h3 className="font-serif text-2xl font-bold text-[#111111]">
                  Artículos Relacionados en {category.name}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {relatedPosts.map(rel => (
                    <div
                      key={rel.id}
                      onClick={() => setRoute({ type: 'single', categorySlug: category.slug, postSlug: rel.slug })}
                      className="group cursor-pointer space-y-3"
                    >
                      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#f7f7f7] border border-[#e8e8e8]">
                        <img
                          src={rel.image}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-serif text-sm font-bold text-[#111111] group-hover:text-[#2d5a27] transition-colors line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sticky Sidebar (4 Cols) */}
          <aside className="lg:col-span-4 space-y-8 sticky top-28">
            {/* Most Read Widget */}
            <div className="bg-white border border-[#e8e8e8] rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#111111] border-b-2 border-[#111111] pb-3 mb-5">
                Lo Más Leído
              </h3>

              <div className="space-y-4">
                {popularPosts.map((pop, idx) => {
                  const cat = categories.find(c => c.id === pop.category_id);
                  return (
                    <div
                      key={pop.id}
                      onClick={() => setRoute({ type: 'single', categorySlug: cat?.slug || 'general', postSlug: pop.slug })}
                      className="group flex items-start gap-4 cursor-pointer pb-4 border-b border-[#e8e8e8] last:border-b-0 last:pb-0"
                    >
                      <span className="font-serif text-2xl font-bold text-[#888888]/50 group-hover:text-[#2d5a27] transition-colors shrink-0">
                        0{idx + 1}
                      </span>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2d5a27]">
                          {cat?.name}
                        </span>
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-[#111111] group-hover:text-[#2d5a27] transition-colors line-clamp-2 leading-snug">
                          {pop.title}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Newsletter Mini Card */}
            <div className="bg-[#111111] text-white rounded-2xl p-6 shadow-sm space-y-3 border border-white/10">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                Boletín Diario
              </span>
              <h4 className="font-serif text-lg font-bold">
                Claves para entender la jornada
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Recibe nuestro resumen periodístico matutino con los hechos más relevantes.
              </p>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  alert('¡Suscrito!');
                }}
                className="space-y-2 pt-1"
              >
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  required
                  className="w-full px-3.5 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#2d5a27]"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#2d5a27] hover:bg-[#23491f] text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Suscribirme
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
