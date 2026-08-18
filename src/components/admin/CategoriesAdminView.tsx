import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Category } from '../../types';
import { FolderTree, Plus, Edit3, Trash2, ExternalLink, CheckCircle2 } from 'lucide-react';

export const CategoriesAdminView: React.FC = () => {
  const { categories, posts, saveCategory, deleteCategory, setRoute } = useBlog();
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#2d5a27');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setColor(cat.color || '#2d5a27');
    setSeoTitle(cat.seo_title || '');
    setMetaDesc(cat.meta_description || '');
    setStatus(cat.status);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setColor('#2d5a27');
    setSeoTitle('');
    setMetaDesc('');
    setStatus('active');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cleanSlug = (slug.trim() || name)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    saveCategory({
      id: editingId || undefined,
      name: name.trim(),
      slug: cleanSlug,
      description: description.trim(),
      color: color,
      seo_title: seoTitle.trim() || undefined,
      meta_description: metaDesc.trim() || undefined,
      sort_order: categories.length + 1,
      status: status
    });

    cancelEdit();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111]">
          Gestión de Categorías y Secciones
        </h1>
        <p className="text-xs text-[#888888] mt-1">
          Configura las secciones editoriales visibles en el menú principal y sitemaps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e8e8] shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#111111] border-b border-[#e8e8e8] pb-2">
            {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                Nombre de la Sección <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej: Finanzas, Tecnología, Deportes"
                required
                className="w-full px-3.5 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:border-[#2d5a27] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                Slug de la URL
              </label>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="slug-amigable"
                className="w-full px-3.5 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs font-mono text-[#111111] focus:outline-none focus:border-[#2d5a27]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                Descripción Temática
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                placeholder="Resumen editorial de la sección..."
                className="w-full px-3.5 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">
                  Color Distintivo
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="w-10 h-8 rounded border border-[#e8e8e8] cursor-pointer p-0"
                  />
                  <span className="text-xs font-mono text-[#888888]">{color}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">
                  Estado
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs font-bold text-[#111111] focus:outline-none"
                >
                  <option value="active">Activa (En menú)</option>
                  <option value="inactive">Inactiva (Oculta)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                SEO Title (Opcional)
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
                placeholder="Título optimizado para Google"
                className="w-full px-3.5 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                Meta Description (Opcional)
              </label>
              <textarea
                value={metaDesc}
                onChange={e => setMetaDesc(e.target.value)}
                rows={2}
                placeholder="Descripción para resultados de búsqueda..."
                className="w-full px-3.5 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27]"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#2d5a27] hover:bg-[#23491f] text-white font-extrabold text-xs rounded-xl shadow transition-colors"
              >
                {editingId ? 'Guardar Cambios' : 'Crear Categoría'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2.5 bg-[#f7f7f7] hover:bg-[#e8e8e8] text-[#111111] font-bold text-xs rounded-xl border border-[#e8e8e8]"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Column (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e8e8e8] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#e8e8e8]">
            <h2 className="font-serif text-lg font-bold text-[#111111]">
              Categorías Configuradas ({categories.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7f7f7] border-b border-[#e8e8e8] text-[#111111] uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="py-3 px-4">Sección</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Artículos</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e8e8] font-medium">
                {categories.map(cat => {
                  const count = posts.filter(p => p.category_id === cat.id).length;
                  return (
                    <tr key={cat.id} className="hover:bg-[#f7f7f7]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="font-bold text-[#111111]">{cat.name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[#888888]">/{cat.slug}/</td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-[#f7f7f7] text-[#111111] border border-[#e8e8e8] rounded-full font-bold text-[10px]">
                          {count} noticias
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cat.status === 'active'
                              ? 'bg-[#f0f7ef] text-[#2d5a27]'
                              : 'bg-[#f7f7f7] text-[#888888]'
                          }`}
                        >
                          {cat.status === 'active' ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => startEdit(cat)}
                            className="p-1.5 bg-[#f7f7f7] hover:bg-[#e8e8e8] text-[#111111] rounded-lg border border-[#e8e8e8]"
                            title="Editar"
                          >
                            <Edit3 size={13} />
                          </button>

                          <button
                            onClick={() => setRoute({ type: 'category', slug: cat.slug, page: 1 })}
                            className="p-1.5 bg-[#f7f7f7] hover:bg-[#e8e8e8] text-[#111111] rounded-lg border border-[#e8e8e8]"
                            title="Ver en vivo"
                          >
                            <ExternalLink size={13} />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar la categoría "${cat.name}"?`)) {
                                deleteCategory(cat.id);
                              }
                            }}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200"
                            title="Eliminar"
                          >
                            <Trash2 size={13} />
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
    </div>
  );
};
