import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Search, PlusCircle, Trash2, Edit3, ExternalLink, Star, Flame, Eye } from 'lucide-react';

export const PostsListView: React.FC = () => {
  const { posts, categories, authors, setRoute, deletePost, toggleHero, toggleFeatured } = useBlog();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filteredPosts = posts.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter === 0 || p.category_id === catFilter;
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const getCategory = (id: number) => categories.find(c => c.id === id) || categories[0];
  const getAuthor = (id: number) => authors.find(a => a.id === id) || authors[0];

  const handleDelete = (id: number, title: string) => {
    if (confirm(`¿Estás seguro de eliminar el artículo "${title}"?`)) {
      deletePost(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111]">
            Gestión de Noticias y Artículos
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Total: {posts.length} artículos en la base de datos
          </p>
        </div>

        <button
          onClick={() => setRoute({ type: 'admin', subview: 'post-edit' })}
          className="px-4 py-2.5 bg-[#2d5a27] hover:bg-[#23491f] text-white text-xs font-extrabold rounded-xl transition-all shadow flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle size={16} />
          + Redactar Nueva Noticia
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#e8e8e8] shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-3 text-[#888888]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por titular o contenido..."
            className="w-full pl-9 pr-4 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs focus:outline-none focus:border-[#2d5a27] focus:bg-white text-[#111111]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <select
            value={catFilter}
            onChange={e => setCatFilter(Number(e.target.value))}
            className="px-3 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] font-semibold focus:outline-none"
          >
            <option value={0}>Todas las Secciones</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] font-semibold focus:outline-none"
          >
            <option value="">Todos los Estados</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
          </select>

          {(search || catFilter !== 0 || statusFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setCatFilter(0);
                setStatusFilter('');
              }}
              className="px-3 py-2 text-xs font-bold text-[#888888] hover:text-[#111111]"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Table Box */}
      <div className="bg-white rounded-2xl border border-[#e8e8e8] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f7f7] border-b border-[#e8e8e8] text-[#111111] uppercase tracking-wider font-extrabold">
              <tr>
                <th className="py-3.5 px-4" style={{ width: '40%' }}>Noticia & Flags</th>
                <th className="py-3.5 px-4">Sección</th>
                <th className="py-3.5 px-4">Autor</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4">Lecturas</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8] font-medium">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(p => {
                  const cat = getCategory(p.category_id);
                  const auth = getAuthor(p.author_id);
                  return (
                    <tr key={p.id} className="hover:bg-[#f7f7f7]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt=""
                            className="w-14 h-10 rounded-lg object-cover shrink-0 shadow-sm border border-[#e8e8e8]"
                          />
                          <div className="space-y-1">
                            <button
                              onClick={() => setRoute({ type: 'admin', subview: 'post-edit', editId: p.id })}
                              className="font-bold text-[#111111] hover:text-[#2d5a27] text-left line-clamp-2 block leading-snug"
                            >
                              {p.title}
                            </button>
                            <div className="flex items-center gap-1.5">
                              {p.is_hero && (
                                <span className="px-1.5 py-0.5 bg-[#2d5a27] text-white rounded text-[9px] font-extrabold flex items-center gap-0.5">
                                  <Flame size={10} />
                                  HERO
                                </span>
                              )}
                              {p.is_featured && (
                                <span className="px-1.5 py-0.5 bg-[#111111] text-white rounded text-[9px] font-extrabold flex items-center gap-0.5">
                                  <Star size={10} />
                                  DESTACADO
                                </span>
                              )}
                              <span className="text-[10px] text-[#888888]">/{cat.slug}/{p.slug}/</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#f7f7f7] text-[#2d5a27] border border-[#e8e8e8]"
                        >
                          {cat.name}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#111111] font-semibold">{auth.name}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            p.status === 'published'
                              ? 'bg-[#f0f7ef] text-[#2d5a27]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#111111] font-bold">
                        {p.views.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleHero(p.id)}
                            className={`p-1.5 rounded-lg border text-[11px] ${
                              p.is_hero
                                ? 'bg-[#2d5a27] text-white border-[#2d5a27]'
                                : 'bg-white text-[#888888] border-[#e8e8e8] hover:bg-[#f7f7f7]'
                            }`}
                            title="Alternar Noticia Principal (Hero)"
                          >
                            <Flame size={13} />
                          </button>

                          <button
                            onClick={() => toggleFeatured(p.id)}
                            className={`p-1.5 rounded-lg border text-[11px] ${
                              p.is_featured
                                ? 'bg-[#111111] text-white border-[#111111]'
                                : 'bg-white text-[#888888] border-[#e8e8e8] hover:bg-[#f7f7f7]'
                            }`}
                            title="Alternar Destacado en Home"
                          >
                            <Star size={13} />
                          </button>

                          <button
                            onClick={() => setRoute({ type: 'admin', subview: 'post-edit', editId: p.id })}
                            className="p-1.5 bg-[#f7f7f7] hover:bg-[#e8e8e8] text-[#111111] rounded-lg border border-[#e8e8e8]"
                            title="Editar Noticia"
                          >
                            <Edit3 size={13} />
                          </button>

                          <button
                            onClick={() => setRoute({ type: 'single', categorySlug: cat.slug, postSlug: p.slug })}
                            className="p-1.5 bg-[#f7f7f7] hover:bg-[#e8e8e8] text-[#111111] rounded-lg border border-[#e8e8e8]"
                            title="Ver en vivo"
                          >
                            <ExternalLink size={13} />
                          </button>

                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200"
                            title="Eliminar"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#888888]">
                    No se encontraron noticias con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
