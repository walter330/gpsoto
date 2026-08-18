import React, { useRef, useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Flame, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Send,
  Compass,
  TrendingUp,
  Bookmark,
  Play,
  Youtube
} from 'lucide-react';
import { HomeVideoSection } from './HomeVideoSection';

export const HomeView: React.FC = () => {
  const { posts, categories, authors, setRoute } = useBlog();
  const carouselRef = useRef<HTMLDivElement>(null);

  const publishedPosts = posts.filter(p => p.status === 'published');
  const heroPost = publishedPosts.find(p => p.is_hero) || publishedPosts[0];
  const sideHeroPosts = publishedPosts.filter(p => p.id !== heroPost?.id).slice(0, 3);
  const featuredPosts = publishedPosts.filter(p => p.is_featured);
  const latestFeed = publishedPosts.filter(p => p.id !== heroPost?.id && !sideHeroPosts.some(s => s.id === p.id));

  // Category Focus Sections (e.g. Economía, Innovación)
  const focusCategories = categories.filter(c => c.status === 'active').slice(0, 2);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getCategory = (catId: number) => categories.find(c => c.id === catId) || categories[0];
  const getAuthor = (authId: number) => authors.find(a => a.id === authId) || authors[0];

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return `${Math.max(2, Math.ceil(words / 200))} min`;
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-12 sm:space-y-16">
      {/* 1. HERO SECTION (12-Col Responsive Grid) */}
      <section className="border-b border-[#e5e7eb] pb-10 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main Large Hero Story (7 cols on desktop) */}
          {heroPost && (
            <div className="lg:col-span-7 group">
              {(() => {
                const cat = getCategory(heroPost.category_id);
                const auth = getAuthor(heroPost.author_id);
                return (
                  <article
                    onClick={() => setRoute({ type: 'single', categorySlug: cat.slug, postSlug: heroPost.slug })}
                    className="cursor-pointer space-y-4"
                  >
                    {/* Hero Image Container with aspect ratio */}
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-[#f8f9fa] border border-[#e5e7eb] shadow-xs">
                      <img
                        src={heroPost.image}
                        alt={heroPost.image_alt || heroPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                      {/* Category & Video Pill on top of image */}
                      <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10 flex items-center gap-2">
                        <span
                          className="px-3 py-1 text-white text-[11px] sm:text-xs font-extrabold uppercase tracking-wider rounded-full shadow-md backdrop-blur-md"
                          style={{ backgroundColor: cat.color || '#2d5a27' }}
                        >
                          {cat.name}
                        </span>
                        {heroPost.youtube_url && (
                          <span className="px-2.5 py-1 bg-red-600/90 text-white text-[11px] font-bold rounded-full shadow-md backdrop-blur-md flex items-center gap-1">
                            <Play size={11} className="fill-white" />
                            <span>Video YouTube</span>
                          </span>
                        )}
                      </div>

                      {/* Read time badge */}
                      <div className="absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold rounded-full">
                        <Clock size={12} />
                        <span>{getReadingTime(heroPost.content)}</span>
                      </div>
                    </div>

                    {/* Hero Metadata & Typography */}
                    <div className="space-y-3 px-1 sm:px-0">
                      <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[34px] xl:text-[38px] font-extrabold text-[#111111] group-hover:text-[#2d5a27] transition-colors leading-[1.18] tracking-tight">
                        {heroPost.title}
                      </h1>

                      <p className="text-neutral-700 text-sm sm:text-base leading-relaxed line-clamp-3">
                        {heroPost.excerpt}
                      </p>

                      {/* Author line & Date */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-neutral-700">
                        <div className="flex items-center gap-2">
                          <img
                            src={auth.avatar}
                            alt={auth.name}
                            className="w-6 h-6 rounded-full object-cover border border-[#e5e7eb]"
                          />
                          <span className="font-bold text-[#111111] hover:underline">
                            {auth.name}
                          </span>
                        </div>
                        <span className="text-[#6b7280]">•</span>
                        <span className="text-[#6b7280] font-medium">
                          {formatDate(heroPost.published_at)}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })()}
            </div>
          )}

          {/* Side Lead Stories (5 cols on desktop, stacked on mobile) */}
          <div className="lg:col-span-5 flex flex-col divide-y divide-[#e5e7eb] lg:border-l lg:border-[#e5e7eb] lg:pl-8">
            <div className="pb-3 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#2d5a27] flex items-center gap-1.5">
                <Flame size={14} className="text-[#2d5a27]" />
                En Portada Hoy
              </span>
              <span className="text-xs text-[#6b7280] font-semibold">Selección editorial</span>
            </div>

            {sideHeroPosts.map((post, idx) => {
              const cat = getCategory(post.category_id);
              const author = getAuthor(post.author_id);
              return (
                <article
                  key={post.id}
                  onClick={() => setRoute({ type: 'single', categorySlug: cat.slug, postSlug: post.slug })}
                  className="py-4 sm:py-5 first:pt-1 group cursor-pointer"
                >
                  <div className="flex gap-4 items-start">
                    {/* Thumbnail Image */}
                    <div className="relative w-24 sm:w-28 h-20 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-[#f8f9fa] border border-[#e5e7eb]">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-extrabold flex items-center justify-center">
                        {idx + 1}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ 
                            color: cat.color || '#2d5a27',
                            backgroundColor: `${cat.color || '#2d5a27'}15`
                          }}
                        >
                          {cat.name}
                        </span>
                        <span className="text-[11px] text-[#6b7280]">
                          {getReadingTime(post.content)}
                        </span>
                      </div>

                      <h2 className="font-serif text-sm sm:text-base font-bold text-[#111111] group-hover:text-[#2d5a27] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h2>

                      <div className="flex items-center gap-2 text-[11px] text-[#6b7280] truncate">
                        <span className="font-semibold text-neutral-800 truncate">{author.name}</span>
                        <span>•</span>
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. FEATURED STORIES STRIP (Curated Carousel) */}
      {featuredPosts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-[#2d5a27] rounded-xs" />
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-[#111111] tracking-tight">
                  Historias Destacadas
                </h2>
                <p className="text-xs text-[#6b7280]">Investigaciones y reportajes especiales</p>
              </div>
            </div>

            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollCarousel('left')}
                className="p-2 rounded-full border border-[#e5e7eb] hover:bg-[#f8f9fa] active:scale-95 transition-all text-[#111111]"
                aria-label="Anterior historia"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="p-2 rounded-full border border-[#e5e7eb] hover:bg-[#f8f9fa] active:scale-95 transition-all text-[#111111]"
                aria-label="Siguiente historia"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Horizontal Scroller Container */}
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x snap-mandatory"
          >
            {featuredPosts.map(post => {
              const cat = getCategory(post.category_id);
              const author = getAuthor(post.author_id);
              return (
                <article
                  key={post.id}
                  onClick={() => setRoute({ type: 'single', categorySlug: cat.slug, postSlug: post.slug })}
                  className="w-[82vw] sm:w-[320px] md:w-[340px] shrink-0 snap-start bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden hover:border-[#2d5a27]/50 hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Card Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#f8f9fa]">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span 
                          className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white rounded-full shadow-xs backdrop-blur-xs"
                          style={{ backgroundColor: cat.color || '#2d5a27' }}
                        >
                          {cat.name}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-[#6b7280]">
                        <Clock size={12} />
                        <span>{getReadingTime(post.content)}</span>
                      </div>

                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#111111] group-hover:text-[#2d5a27] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-xs text-neutral-700 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 sm:p-5 pt-0 mt-auto border-t border-[#e5e7eb]/60 flex items-center justify-between text-xs text-[#6b7280]">
                    <span className="font-bold text-neutral-800 truncate">{author.name}</span>
                    <span className="shrink-0">{formatDate(post.published_at)}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* 2.5. FEATURED YOUTUBE & MULTIMEDIA SECTION */}
      <HomeVideoSection />

      {/* 3. LATEST STORIES FEED ("Últimas Noticias") */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-6 bg-[#2d5a27] rounded-xs" />
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-[#111111] tracking-tight">
                Últimas Noticias & Análisis
              </h2>
              <p className="text-xs text-[#6b7280]">Información continua verificada por nuestra redacción</p>
            </div>
          </div>

          <span className="text-xs font-bold text-[#2d5a27] bg-[#f0f7ef] px-3 py-1 rounded-full border border-[#2d5a27]/20">
            {publishedPosts.length} Noticias
          </span>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {latestFeed.map(post => {
            const cat = getCategory(post.category_id);
            const author = getAuthor(post.author_id);
            return (
              <article
                key={post.id}
                onClick={() => setRoute({ type: 'single', categorySlug: cat.slug, postSlug: post.slug })}
                className="group cursor-pointer bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden hover:border-[#2d5a27]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail with overlay */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#f8f9fa]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span 
                        className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white rounded-full shadow-xs"
                        style={{ backgroundColor: cat.color || '#2d5a27' }}
                      >
                        {cat.name}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-[#6b7280]">
                      <Clock size={12} />
                      <span>{getReadingTime(post.content)}</span>
                      <span>•</span>
                      <span>{formatDate(post.published_at)}</span>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#111111] group-hover:text-[#2d5a27] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-neutral-700 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-5 pt-3 border-t border-[#e5e7eb] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-5 h-5 rounded-full object-cover border border-[#e5e7eb]"
                    />
                    <span className="text-xs font-bold text-[#111111] truncate">{author.name}</span>
                  </div>

                  <span className="text-xs font-bold text-[#2d5a27] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Leer <ArrowRight size={12} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. MAGAZINE CATEGORY CURATED SECTION */}
      {focusCategories.map(cat => {
        const catPosts = publishedPosts.filter(p => p.category_id === cat.id).slice(0, 4);
        if (catPosts.length === 0) return null;
        const leadCatPost = catPosts[0];
        const subCatPosts = catPosts.slice(1);

        return (
          <section key={cat.id} className="pt-6 border-t border-[#e5e7eb] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-6 rounded-xs" style={{ backgroundColor: cat.color || '#2d5a27' }} />
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-[#111111] tracking-tight">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-[#6b7280]">{cat.description || 'Reportajes especializados'}</p>
                </div>
              </div>

              <button
                onClick={() => setRoute({ type: 'category', slug: cat.slug, page: 1 })}
                className="text-xs font-bold text-[#2d5a27] hover:underline flex items-center gap-1"
              >
                Ver todo en {cat.name} <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Lead Story for Category (7 Cols) */}
              <div
                onClick={() => setRoute({ type: 'single', categorySlug: cat.slug, postSlug: leadCatPost.slug })}
                className="lg:col-span-7 bg-[#f8f9fa] rounded-2xl overflow-hidden border border-[#e5e7eb] cursor-pointer group hover:border-[#2d5a27]/40 transition-all p-4 sm:p-6 space-y-4"
              >
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                  <img
                    src={leadCatPost.image}
                    alt={leadCatPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                    <span className="font-bold text-[#2d5a27]">{cat.name}</span>
                    <span>•</span>
                    <span>{formatDate(leadCatPost.published_at)}</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#111111] group-hover:text-[#2d5a27] transition-colors leading-tight">
                    {leadCatPost.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-700 line-clamp-3 leading-relaxed">
                    {leadCatPost.excerpt}
                  </p>
                </div>
              </div>

              {/* Sub Stories List for Category (5 Cols) */}
              <div className="lg:col-span-5 divide-y divide-[#e5e7eb] bg-white rounded-2xl p-4 sm:p-5 border border-[#e5e7eb]">
                {subCatPosts.map(subPost => (
                  <div
                    key={subPost.id}
                    onClick={() => setRoute({ type: 'single', categorySlug: cat.slug, postSlug: subPost.slug })}
                    className="py-3.5 first:pt-0 last:pb-0 cursor-pointer group"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-[#f8f9fa] border border-[#e5e7eb]">
                        <img
                          src={subPost.image}
                          alt={subPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] text-[#6b7280] font-medium">
                          {formatDate(subPost.published_at)}
                        </span>
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-[#111111] group-hover:text-[#2d5a27] transition-colors line-clamp-2 leading-snug">
                          {subPost.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* 5. NEWSLETTER EDITORIAL SUBSCRIPTION */}
      <section className="bg-[#111111] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 relative overflow-hidden border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#2d5a27]/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#2d5a27]/40 border border-[#2d5a27] text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
            <Sparkles size={12} />
            Boletín Informativo Diario
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            El Pulso de la Jornada en Tu Correo
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg mx-auto">
            Recibe cada mañana a las 7:00 AM el análisis periodístico más riguroso, síntesis de mercados e investigaciones exclusivas sin publicidad invasiva.
          </p>

          <form
            onSubmit={e => {
              e.preventDefault();
              alert('¡Gracias por suscribirte al boletín de Pulso Editorial!');
            }}
            className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2"
          >
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico..."
              required
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-emerald-400 focus:bg-white/15"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#2d5a27] hover:bg-[#23491f] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <span>Suscribirme</span>
              <Send size={13} />
            </button>
          </form>

          <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400 pt-2">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={13} className="text-emerald-400" /> Sin spam
            </span>
            <span>•</span>
            <span>Cancela cuando quieras</span>
          </div>
        </div>
      </section>
    </div>
  );
};
