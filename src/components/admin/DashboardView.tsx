import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { 
  FileText, 
  FolderTree, 
  Users, 
  Eye, 
  PlusCircle, 
  DownloadCloud, 
  ExternalLink, 
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ShieldCheck,
  Send,
  Globe,
  Sliders
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { posts, categories, authors, setRoute, savePost } = useBlog();
  const [quickTitle, setQuickTitle] = useState('');
  const [quickContent, setQuickContent] = useState('');
  const [quickDraftSaved, setQuickDraftSaved] = useState(false);

  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;

  const handleQuickDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const slug = quickTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    savePost({
      title: quickTitle,
      slug: slug || `borrador-${Date.now()}`,
      excerpt: quickContent.slice(0, 140) || 'Borrador rápido desde el escritorio de WordPress...',
      content: quickContent || '<p>Contenido inicial del borrador...</p>',
      category_id: categories[0]?.id || 1,
      author_id: authors[0]?.id || 1,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
      status: 'draft',
      is_hero: false,
      is_featured: false,
      published_at: new Date().toISOString(),
      robots: 'noindex, nofollow',
      seo: {
        meta_title: quickTitle,
        meta_description: quickContent.slice(0, 155),
        focus_keywords: 'gestión pública, GPSOTO',
        canonical_url: `https://gpsoto.com/${slug}`,
        schema_type: 'NewsArticle',
        og_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'
      }
    });

    setQuickTitle('');
    setQuickContent('');
    setQuickDraftSaved(true);
    setTimeout(() => setQuickDraftSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* WordPress Welcome Banner */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-50 text-[#1e40af] text-[10px] font-extrabold rounded uppercase tracking-wider border border-blue-200">
              WordPress CMS 6.6
            </span>
            <span className="text-xs text-slate-500">gpsoto.com</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Escritorio de Administración
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Gestiona entradas, categorías, autores y el motor SEO con URLs en cascada (<code className="text-blue-700">/categoria/articulo/</code>).
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => setRoute({ type: 'admin', subview: 'post-edit' })}
            className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle size={14} />
            Añadir Nueva Entrada
          </button>
          <button
            onClick={() => setRoute({ type: 'admin', subview: 'seo' })}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors border border-slate-300 flex items-center gap-1.5"
          >
            <Globe size={14} className="text-[#1e40af]" />
            Panel SEO & Schema
          </button>
          <button
            onClick={() => setRoute({ type: 'admin', subview: 'cpanel-export' })}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#1e40af] text-xs font-bold rounded-lg transition-colors border border-blue-200 flex items-center gap-1.5"
          >
            <DownloadCloud size={14} />
            Exportar PHP/cPanel
          </button>
        </div>
      </div>

      {/* Main Grid: At a Glance + Quick Draft + SEO Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: De un vistazo (At a Glance) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Zap size={14} className="text-[#1e40af]" />
              De un vistazo
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">WP Core</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => setRoute({ type: 'admin', subview: 'posts' })}
                className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-lg text-left transition-colors border border-slate-200/80"
              >
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <FileText size={14} className="text-[#1e40af]" />
                  <span className="font-bold text-slate-700">Entradas</span>
                </div>
                <span className="text-xl font-bold text-slate-900">{posts.length}</span>
                <div className="text-[10px] text-slate-500 mt-1">
                  <span className="text-emerald-600 font-bold">{publishedCount} pub.</span> • {draftCount} borrador
                </div>
              </button>

              <button
                onClick={() => setRoute({ type: 'admin', subview: 'categories' })}
                className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-lg text-left transition-colors border border-slate-200/80"
              >
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <FolderTree size={14} className="text-[#1e40af]" />
                  <span className="font-bold text-slate-700">Categorías</span>
                </div>
                <span className="text-xl font-bold text-slate-900">{categories.length}</span>
                <div className="text-[10px] text-slate-500 mt-1">
                  {categories.filter(c => c.status === 'active').length} activas en menú
                </div>
              </button>

              <button
                onClick={() => setRoute({ type: 'admin', subview: 'authors' })}
                className="p-3 bg-slate-50 hover:bg-blue-50/60 rounded-lg text-left transition-colors border border-slate-200/80"
              >
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Users size={14} className="text-[#1e40af]" />
                  <span className="font-bold text-slate-700">Autores</span>
                </div>
                <span className="text-xl font-bold text-slate-900">{authors.length}</span>
                <div className="text-[10px] text-slate-500 mt-1">
                  Perfiles periodísticos
                </div>
              </button>

              <div className="p-3 bg-slate-50 rounded-lg text-left border border-slate-200/80">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Eye size={14} className="text-[#1e40af]" />
                  <span className="font-bold text-slate-700">Lecturas</span>
                </div>
                <span className="text-xl font-bold text-slate-900">{totalViews.toLocaleString()}</span>
                <div className="text-[10px] text-blue-600 font-bold mt-1">
                  Tráfico Orgánico
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Tema: <strong>Editorial GPSoto Pro</strong></span>
              <span className="text-[#1e40af] font-semibold">URLs en Cascada Activas</span>
            </div>
          </div>
        </div>

        {/* Widget 2: Borrador Rápido (Quick Draft) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <FileText size={14} className="text-[#1e40af]" />
              Borrador Rápido
            </h3>
            <span className="text-[11px] text-slate-500">Auto-Guardar</span>
          </div>

          <form onSubmit={handleQuickDraft} className="p-5 space-y-3">
            {quickDraftSaved && (
              <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs flex items-center gap-1.5 font-bold">
                <CheckCircle2 size={14} className="text-emerald-600" />
                ¡Borrador guardado correctamente en la base de datos!
              </div>
            )}

            <div>
              <input
                type="text"
                value={quickTitle}
                onChange={e => setQuickTitle(e.target.value)}
                placeholder="Título del artículo o nota..."
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2271b1] focus:bg-white"
              />
            </div>

            <div>
              <textarea
                value={quickContent}
                onChange={e => setQuickContent(e.target.value)}
                rows={3}
                placeholder="¿De qué trata esta nota? Ideas clave, enlaces y fuentes..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#2271b1] focus:bg-white resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Send size={12} />
                Guardar Borrador
              </button>
              <button
                type="button"
                onClick={() => setRoute({ type: 'admin', subview: 'post-edit' })}
                className="text-xs text-[#2271b1] hover:underline font-semibold"
              >
                Abrir editor completo →
              </button>
            </div>
          </form>
        </div>

        {/* Widget 3: Salud del Sitio & Yoast/RankMath Score */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              Auditoría SEO & Salud
            </h3>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
              100 / 100
            </span>
          </div>

          <div className="p-5 space-y-3.5 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">URLs en Cascada con Categoría</span>
                <span className="text-[11px] text-slate-500">Estructura canónica: <code className="text-blue-700 font-mono text-[10px]">gpsoto.com/:categoria/:slug</code></span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Schema.org JSON-LD NewsArticle</span>
                <span className="text-[11px] text-slate-500">Microdatos listos para Google News y carruseles destacados.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">BreadcrumbList & Open Graph</span>
                <span className="text-[11px] text-slate-500">Mapeo jerárquico de migas de pan y tarjetas Twitter / Facebook.</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setRoute({ type: 'admin', subview: 'seo' })}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-[#1e40af] font-bold rounded-lg text-center transition-colors block border border-blue-200"
              >
                Abrir Generador de Sitemaps & Schemas →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts Table (WordPress Posts Screen Preview) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Actividad Reciente (Entradas)
            </h3>
            <p className="text-xs text-slate-500">Últimos artículos redactados y publicados en gpsoto.com</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRoute({ type: 'admin', subview: 'posts' })}
              className="text-xs font-bold text-[#2271b1] hover:underline"
            >
              Ver todas las entradas ({posts.length}) →
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">Título & URL Cascada</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Autor</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Lecturas</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {posts.slice(0, 6).map(p => {
                const cat = categories.find(c => c.id === p.category_id);
                const auth = authors.find(a => a.id === p.author_id);
                const cascadeUrl = `/${cat?.slug || 'opinion'}/${p.slug}/`;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-11 h-9 rounded object-cover shrink-0 border border-slate-200" />
                        <div>
                          <span className="font-bold text-slate-900 block line-clamp-1">{p.title}</span>
                          <span className="text-[10px] text-blue-600 font-mono block mt-0.5">{cascadeUrl}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {cat?.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{auth?.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {p.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-bold">{p.views.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setRoute({ type: 'admin', subview: 'post-edit', editId: p.id })}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-bold text-[11px] border border-slate-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setRoute({ type: 'single', categorySlug: cat?.slug || 'general', postSlug: p.slug })}
                          className="p-1 text-slate-400 hover:text-[#1e40af]"
                          title="Ver en vivo"
                        >
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

