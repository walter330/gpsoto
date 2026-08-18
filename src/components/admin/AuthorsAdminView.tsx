import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Author } from '../../types';
import { Users, Edit3, Trash2, ExternalLink, Twitter, Linkedin, CheckCircle2 } from 'lucide-react';

export const AuthorsAdminView: React.FC = () => {
  const { authors, posts, saveAuthor, deleteAuthor, setRoute } = useBlog();
  const [editingId, setEditingId] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const startEdit = (author: Author) => {
    setEditingId(author.id);
    setName(author.name);
    setSlug(author.slug);
    setRoleTitle(author.role_title);
    setAvatar(author.avatar);
    setBio(author.bio);
    setTwitter(author.twitter || '');
    setLinkedin(author.linkedin || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setRoleTitle('');
    setAvatar('');
    setBio('');
    setTwitter('');
    setLinkedin('');
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

    saveAuthor({
      id: editingId || undefined,
      name: name.trim(),
      slug: cleanSlug,
      role_title: roleTitle.trim(),
      avatar: avatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: bio.trim(),
      twitter: twitter.trim() || undefined,
      linkedin: linkedin.trim() || undefined
    });

    cancelEdit();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#111111]">
          Equipo Editorial & Redactores
        </h1>
        <p className="text-xs text-[#888888] mt-1">
          Gestiona los perfiles de los periodistas, columnistas y analistas del medio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e8e8e8] shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#111111] border-b border-[#e8e8e8] pb-2">
            {editingId ? 'Editar Redactor' : 'Nuevo Redactor'}
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej: Carlos Mendoza"
                required
                className="w-full px-3.5 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:border-[#2d5a27] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                Cargo / Especialidad
              </label>
              <input
                type="text"
                value={roleTitle}
                onChange={e => setRoleTitle(e.target.value)}
                placeholder="Ej: Jefe de Redacción & Mercados"
                required
                className="w-full px-3.5 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                URL del Avatar / Fotografía
              </label>
              <input
                type="url"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                Biografía Editorial
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                placeholder="Breve trayectoria profesional y áreas de investigación..."
                className="w-full px-3.5 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Usuario en X (Twitter)</label>
                <input
                  type="text"
                  value={twitter}
                  onChange={e => setTwitter(e.target.value)}
                  placeholder="usuario_sin_arroba"
                  className="w-full px-3.5 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Perfil LinkedIn</label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={e => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3.5 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27]"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#2d5a27] hover:bg-[#23491f] text-white font-extrabold text-xs rounded-xl shadow transition-colors"
              >
                {editingId ? 'Guardar Cambios' : 'Registrar Redactor'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2.5 bg-[#f7f7f7] hover:bg-[#e8e8e8] text-[#111111] font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e8e8e8] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#e8e8e8]">
            <h2 className="font-serif text-lg font-bold text-[#111111]">
              Redactores Registrados ({authors.length})
            </h2>
          </div>

          <div className="divide-y divide-[#e8e8e8]">
            {authors.map(author => {
              const authorPostsCount = posts.filter(p => p.author_id === author.id).length;
              return (
                <div key={author.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-[#f7f7f7]/60 transition-colors">
                  <div className="flex items-start gap-4">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#e8e8e8]"
                    />
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm text-[#111111]">{author.name}</h3>
                      <p className="text-xs text-[#2d5a27] font-semibold">{author.role_title}</p>
                      <p className="text-xs text-[#888888] line-clamp-2">{author.bio}</p>
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-[#888888]">
                        <span className="font-bold text-[#111111]">{authorPostsCount} artículos publicados</span>
                        {author.twitter && <span>• @{author.twitter}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => startEdit(author)}
                      className="p-1.5 bg-[#f7f7f7] hover:bg-[#e8e8e8] text-[#111111] rounded-lg border border-[#e8e8e8]"
                      title="Editar"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => setRoute({ type: 'author', slug: author.slug })}
                      className="p-1.5 bg-[#f7f7f7] hover:bg-[#e8e8e8] text-[#111111] rounded-lg border border-[#e8e8e8]"
                      title="Ver perfil público"
                    >
                      <ExternalLink size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar al autor ${author.name}?`)) {
                          deleteAuthor(author.id);
                        }
                      }}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200"
                      title="Eliminar"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
