import React from 'react';
import { useBlog } from '../context/BlogContext';
import { Rss, FileCode2, Shield, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { categories, settings, setRoute } = useBlog();
  const activeCategories = categories.filter(c => c.status === 'active');

  return (
    <footer className="bg-[#0f172a] text-[#94a3b8] border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-[#1e40af] inline-block rounded-xs" />
              <span className="font-serif font-bold text-2xl tracking-tight text-white">
                {settings.site_name || 'GPSOTO'}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              {settings.footer_about ||
                'GPSOTO (https://gpsoto.com) es una plataforma periodística independiente y observatorio de asuntos públicos comprometido con el rigor documental, la transparencia estatal y la fiscalización ciudadana.'}
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-blue-400" />
                WordPress Style
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-blue-400" />
                Schema.org
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-blue-400" />
                PHP / MySQL
              </span>
            </div>
          </div>

          {/* Column 2: Editorial Sections */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-5">
              Secciones Editoriales
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button
                  onClick={() => setRoute({ type: 'home' })}
                  className="hover:text-white transition-colors"
                >
                  Portada Principal
                </button>
              </li>
              {activeCategories.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => setRoute({ type: 'category', slug: cat.slug, page: 1 })}
                    className="hover:text-white transition-colors flex items-center justify-between w-full"
                  >
                    <span>{cat.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e40af]" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Feeds & Technical SEO */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-5">
              Canales & Sitemaps XML
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button
                  onClick={() => setRoute({ type: 'admin', subview: 'seo' })}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FileCode2 size={14} className="text-blue-400" />
                  <span>Sitemap General (XML)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute({ type: 'admin', subview: 'seo' })}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FileCode2 size={14} className="text-blue-400" />
                  <span>Google News Sitemap</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute({ type: 'admin', subview: 'seo' })}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Rss size={14} className="text-amber-400" />
                  <span>Feed RSS 2.0 Dinámico</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setRoute({ type: 'admin', subview: 'cpanel-export' })}
                  className="hover:text-blue-300 transition-colors flex items-center gap-1.5 text-blue-400 font-bold"
                >
                  <ArrowUpRight size={14} />
                  <span>Exportar PHP / cPanel</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-5">
              Edición Matutina
            </h4>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Recibe las claves del análisis institucional, infraestructura y jurisprudencia pública.
            </p>
            <form
              onSubmit={e => {
                e.preventDefault();
                alert('¡Gracias por suscribirte al boletín editorial de GPSOTO!');
              }}
              className="space-y-2"
            >
              <input
                type="email"
                placeholder="tu@correo.com"
                required
                className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#1e40af] hover:bg-[#1d4ed8] text-white text-xs font-extrabold rounded-lg transition-colors shadow"
              >
                Suscribirme Gratis
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {settings.site_name || 'GPSOTO'} (https://gpsoto.com). Estructura SEO en cascada y WordPress CMS.
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setRoute({ type: 'admin', subview: 'dashboard' })}
              className="flex items-center gap-1 hover:text-white font-semibold text-blue-400"
            >
              <Shield size={13} />
              <span>Panel WP-Admin</span>
            </button>
            <button
              onClick={() => setRoute({ type: 'admin', subview: 'cpanel-export' })}
              className="hover:text-white"
            >
              Archivos .PHP + .SQL
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
