import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Search, Menu, X, ShieldCheck, DownloadCloud, Compass, Plus, LayoutDashboard, FileText, Globe, LogOut, CheckCircle2 } from 'lucide-react';

export const Header: React.FC = () => {
  const { categories, settings, route, setRoute, setIsSearchOpen, isAdminLoggedIn, loginAdmin, logoutAdmin } = useBlog();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeCategories = categories.filter(c => c.status === 'active');
  const currentCategorySlug = route.type === 'category' ? route.slug : '';

  const currentDateFormatted = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] shadow-xs">
      {/* WordPress-style Top Admin Bar when logged in */}
      {isAdminLoggedIn ? (
        <div className="bg-[#1d2327] text-[#c3c4c7] text-xs px-3 sm:px-6 py-1.5 border-b border-[#2c3338] flex items-center justify-between gap-4 z-50">
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setRoute({ type: 'admin', subview: 'dashboard' })}
              className="flex items-center gap-1.5 text-white font-bold hover:text-[#72aee6] transition-colors shrink-0"
              title="Escritorio de WordPress"
            >
              <div className="w-4 h-4 rounded-full bg-[#2271b1] text-white flex items-center justify-center font-serif text-[10px] font-black">
                W
              </div>
              <span className="hidden sm:inline">GPSoto Admin</span>
            </button>

            <span className="text-white/20 hidden sm:inline">|</span>

            <button
              onClick={() => setRoute({ type: 'admin', subview: 'post-edit' })}
              className="flex items-center gap-1 text-[#c3c4c7] hover:text-white font-semibold transition-colors shrink-0 text-[11px]"
            >
              <Plus size={13} className="text-[#72aee6]" />
              <span>Añadir Entrada</span>
            </button>

            <button
              onClick={() => setRoute({ type: 'admin', subview: 'seo' })}
              className="flex items-center gap-1 text-[#c3c4c7] hover:text-white font-semibold transition-colors shrink-0 text-[11px]"
            >
              <Globe size={12} className="text-emerald-400" />
              <span>SEO & Schema</span>
            </button>

            <button
              onClick={() => setRoute({ type: 'admin', subview: 'cpanel-export' })}
              className="flex items-center gap-1 text-[#72aee6] hover:text-white font-semibold transition-colors shrink-0 text-[11px]"
            >
              <DownloadCloud size={12} />
              <span>Exportar PHP/cPanel</span>
            </button>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[11px]">
            <span className="text-white/70 hidden md:inline">Hola, <strong>Admin</strong></span>
            <button
              onClick={logoutAdmin}
              className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <LogOut size={12} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      ) : (
        /* Top News Ticker Bar when guest */
        <div className="bg-[#0f172a] text-[#f8fafc] text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 border-b border-slate-800">
          <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="inline-flex items-center gap-1.5 font-extrabold text-[#60a5fa] bg-blue-950/80 px-2 py-0.5 rounded-full uppercase tracking-wider text-[9px] sm:text-[10px] shrink-0 border border-blue-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] animate-pulse" />
                Directo
              </span>
              <span className="text-slate-300 truncate text-[11px] sm:text-xs font-normal">
                Observatorio de gestión pública, contrataciones de infraestructura y análisis judicial.
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-[11px]">
              <button
                onClick={() => {
                  loginAdmin('admin', 'admin123');
                  setRoute({ type: 'admin', subview: 'dashboard' });
                }}
                className="inline-flex items-center gap-1 text-[#60a5fa] hover:text-blue-300 font-semibold transition-colors bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30"
                title="Acceso directo de administración estilo WordPress"
              >
                <ShieldCheck size={12} />
                <span>Acceso WP-Admin (1 Clic)</span>
              </button>
              <span className="text-white/20 hidden md:inline">|</span>
              <span className="text-slate-400 font-medium capitalize hidden sm:inline">
                {currentDateFormatted}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar / Masthead */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo Masthead */}
        <button
          onClick={() => setRoute({ type: 'home' })}
          className="text-left group flex items-center gap-2.5 sm:gap-3 focus:outline-none shrink-0"
        >
          <span className="w-2 sm:w-2.5 h-6 sm:h-7 bg-[#1e40af] rounded-xs inline-block shrink-0 transition-transform group-hover:scale-y-110" />
          <div className="flex flex-col">
            <span className="font-serif font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight text-[#0f172a] group-hover:text-[#1e40af] transition-colors leading-none">
              {settings.site_name || 'GPSOTO'}
            </span>
            <span className="text-[9px] sm:text-[10px] font-extrabold tracking-widest text-[#64748b] uppercase mt-0.5">
              INVESTIGACIÓN & ASUNTOS PÚBLICOS
            </span>
          </div>
        </button>

        {/* Desktop Main Category Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          <button
            onClick={() => setRoute({ type: 'home' })}
            className={`text-[13px] xl:text-[14px] font-bold tracking-tight transition-all py-1.5 px-1 relative ${
              route.type === 'home' ? 'text-[#1e40af]' : 'text-[#0f172a] hover:text-[#1e40af]'
            }`}
          >
            Portada
            {route.type === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e40af] rounded-full" />
            )}
          </button>

          {activeCategories.slice(0, 5).map(cat => {
            const isActive = currentCategorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setRoute({ type: 'category', slug: cat.slug, page: 1 })}
                className={`text-[13px] xl:text-[14px] font-bold tracking-tight transition-all py-1.5 px-1 relative ${
                  isActive ? 'text-[#1e40af]' : 'text-slate-700 hover:text-[#1e40af]'
                }`}
              >
                {cat.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1e40af] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-3.5 py-2 bg-[#f8fafc] hover:bg-[#e2e8f0] text-[#0f172a] rounded-full text-xs font-semibold transition-all border border-[#e2e8f0] active:scale-95"
            title="Buscar artículos"
            aria-label="Buscar artículos"
          >
            <Search size={14} className="text-[#64748b]" />
            <span className="hidden md:inline">Buscar</span>
          </button>

          {/* WordPress Admin Access Button */}
          <button
            onClick={() => setRoute({ type: 'admin', subview: 'dashboard' })}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 shadow-xs ${
              isAdminLoggedIn
                ? 'bg-[#1e40af] hover:bg-[#1d4ed8] text-white'
                : 'bg-[#1d2327] hover:bg-[#2271b1] text-white'
            }`}
            title="Panel de Control Editorial WordPress"
          >
            <ShieldCheck size={14} />
            <span className="hidden sm:inline">{isAdminLoggedIn ? 'Panel WP-Admin' : 'WP-Admin'}</span>
            <span className="sm:hidden">WP</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#0f172a] hover:bg-[#f8fafc] rounded-xl border border-[#e2e8f0] transition-colors focus:outline-none"
            aria-label="Abrir menú de navegación"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Subnav Horizontal Category Scroller */}
      <div className="bg-[#f8fafc] border-t border-[#e2e8f0] py-2 px-4 sm:px-6 overflow-x-auto no-scrollbar">
        <div className="max-w-[1240px] mx-auto flex items-center gap-2 sm:gap-3 text-xs font-bold whitespace-nowrap">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748b] flex items-center gap-1 shrink-0 pr-1">
            <Compass size={12} className="text-[#1e40af]" />
            Secciones:
          </span>

          <button
            onClick={() => setRoute({ type: 'home' })}
            className={`px-3 py-1 rounded-full text-xs transition-colors shrink-0 ${
              route.type === 'home'
                ? 'bg-[#1e40af] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-[#e2e8f0]'
            }`}
          >
            Portada
          </button>

          {activeCategories.map(cat => {
            const isActive = currentCategorySlug === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setRoute({ type: 'category', slug: cat.slug, page: 1 })}
                className={`px-3 py-1 rounded-full text-xs transition-colors shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#1e40af] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:text-slate-900 border border-[#e2e8f0]'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: isActive ? '#ffffff' : cat.color || '#1e40af' }}
                />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#e2e8f0] px-5 py-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-4">
            {/* Quick Search inside Drawer */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar noticias..."
                onFocus={() => {
                  setMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm text-slate-800 placeholder-[#64748b] focus:outline-none"
              />
              <Search size={16} className="absolute left-3 top-3 text-[#64748b]" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748b] block mb-2">
                Explorar Secciones
              </span>

              <button
                onClick={() => {
                  setRoute({ type: 'home' });
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm flex items-center justify-between ${
                  route.type === 'home' ? 'bg-blue-50 text-[#1e40af]' : 'text-[#0f172a] hover:bg-[#f8fafc]'
                }`}
              >
                <span>Portada Principal</span>
                <span className="text-xs text-[#64748b]">Inicio</span>
              </button>

              {activeCategories.map(cat => {
                const isActive = currentCategorySlug === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setRoute({ type: 'category', slug: cat.slug, page: 1 });
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2.5 px-3 rounded-xl font-bold text-sm flex items-center justify-between transition-colors ${
                      isActive ? 'bg-blue-50 text-[#1e40af]' : 'text-[#0f172a] hover:bg-[#f8fafc]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color || '#1e40af' }}
                      />
                      <span>{cat.name}</span>
                    </div>
                    <span className="text-[11px] text-[#64748b] font-normal font-mono">/{cat.slug}/</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#e2e8f0] space-y-2">
              <button
                onClick={() => {
                  if (!isAdminLoggedIn) loginAdmin('admin', 'admin123');
                  setRoute({ type: 'admin', subview: 'dashboard' });
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-[#1d2327] hover:bg-[#2271b1] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16} />
                Acceder a WP-Admin (Panel WordPress)
              </button>

              <button
                onClick={() => {
                  setRoute({ type: 'admin', subview: 'cpanel-export' });
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 bg-blue-50 text-[#1e40af] border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <DownloadCloud size={16} />
                Descargar Paquete PHP + MySQL cPanel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
