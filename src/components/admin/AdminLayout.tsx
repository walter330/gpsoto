import React, { ReactNode } from 'react';
import { useBlog } from '../../context/BlogContext';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  FolderTree, 
  Users, 
  Image as ImageIcon, 
  Settings, 
  Globe, 
  LogOut, 
  DownloadCloud,
  ChevronRight,
  ExternalLink,
  Plus,
  MessageSquare,
  Sparkles,
  Sliders,
  CheckCircle,
  BarChart3
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  activeSub: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeSub }) => {
  const { setRoute, logoutAdmin, settings, posts, categories, authors } = useBlog();

  const navItems = [
    { id: 'dashboard', label: 'Escritorio', icon: LayoutDashboard },
    { id: 'posts', label: 'Entradas', icon: FileText, badge: posts.length },
    { id: 'post-edit', label: 'Añadir nueva', icon: PlusCircle, indent: true },
    { id: 'categories', label: 'Categorías', icon: FolderTree, badge: categories.length },
    { id: 'media', label: 'Medios', icon: ImageIcon },
    { id: 'authors', label: 'Usuarios / Autores', icon: Users, badge: authors.length },
    { id: 'seo', label: 'SEO & Schema.org', icon: Globe, highlight: true },
    { id: 'settings', label: 'Ajustes Generales', icon: Settings },
    { id: 'cpanel-export', label: 'Exportar PHP/cPanel', icon: DownloadCloud, special: true },
  ];

  return (
    <div className="min-h-screen bg-[#f0f0f1] flex flex-col">
      {/* WordPress Top Admin Bar (WP-Bar) */}
      <header className="bg-[#1d2327] text-[#c3c4c7] h-8 text-xs flex items-center justify-between px-3 sm:px-4 shrink-0 z-50 border-b border-[#2c3338]">
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar">
          {/* WP Logo */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#2271b1] text-white flex items-center justify-center font-serif text-[11px] font-black">
              W
            </div>
            <span className="font-bold text-white hidden sm:inline">{settings.site_name || 'GPSOTO'}</span>
          </div>

          <button
            onClick={() => setRoute({ type: 'home' })}
            className="flex items-center gap-1 hover:text-[#72aee6] text-[#c3c4c7] transition-colors"
            title="Ver sitio público"
          >
            <ExternalLink size={12} />
            <span className="hidden sm:inline">Visitar Sitio</span>
          </button>

          <span className="text-slate-700">|</span>

          {/* Quick Add */}
          <button
            onClick={() => setRoute({ type: 'admin', subview: 'post-edit' })}
            className="flex items-center gap-1 hover:text-white text-[#c3c4c7] transition-colors"
          >
            <Plus size={13} className="text-[#72aee6]" />
            <span className="hidden md:inline">Añadir Entrada</span>
          </button>

          <button
            onClick={() => setRoute({ type: 'admin', subview: 'seo' })}
            className="hidden md:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <Sparkles size={12} />
            <span>SEO Activo (Rank Math/Schema)</span>
          </button>
        </div>

        {/* User profile & logout */}
        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-300 hidden sm:inline">
            Hola, <strong className="text-white font-semibold">Administrador</strong>
          </span>
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={12} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body: WP Sidebar + Stage */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* WordPress Classic Dark Sidebar (#1d2327) */}
        <aside className="w-full md:w-56 bg-[#1d2327] text-[#c3c4c7] flex flex-col shrink-0 border-r border-[#2c3338]">
          {/* Main Navigation Items */}
          <nav className="py-2 flex-1 space-y-0.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSub === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setRoute({ type: 'admin', subview: item.id as any })}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#2271b1] text-white'
                      : item.special
                      ? 'text-[#72aee6] hover:bg-[#2c3338] hover:text-white'
                      : item.highlight
                      ? 'text-emerald-400 hover:bg-[#2c3338] hover:text-emerald-300'
                      : 'text-[#c3c4c7] hover:bg-[#2c3338] hover:text-[#72aee6]'
                  } ${item.indent ? 'pl-7 text-[11px] bg-black/15' : ''}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className={isActive ? 'text-white' : item.special ? 'text-[#72aee6]' : ''} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#2c3338] text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar System Notice */}
          <div className="p-3 border-t border-[#2c3338] text-[11px] text-slate-400 space-y-1.5 bg-[#171c1f]">
            <div className="flex items-center justify-between font-bold text-slate-300">
              <span>Versión WP/PHP</span>
              <span className="text-[#72aee6]">6.6 / 8.3</span>
            </div>
            <p className="text-[10px] leading-tight text-slate-400">
              Generador estático y dinámico compatible con cPanel & bases de datos SQL.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

