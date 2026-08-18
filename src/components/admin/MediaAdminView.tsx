import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Image as ImageIcon, Plus, Trash2, Copy, Check, ExternalLink } from 'lucide-react';

export const MediaAdminView: React.FC = () => {
  const { media, addMedia, deleteMedia, posts } = useBlog();
  const [url, setUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [altText, setAltText] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Combine media library items + images extracted from posts
  const postImages = posts.map(p => ({
    id: p.id * 1000,
    filename: p.slug + '.jpg',
    filepath: p.image,
    filetype: 'image/jpeg',
    filesize: 184500,
    alt_text: p.image_alt || p.title,
    created_at: p.published_at
  }));

  const allMedia = [...media, ...postImages];

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    addMedia({
      filename: filename.trim() || 'imagen-' + Date.now() + '.jpg',
      filepath: url.trim(),
      filetype: 'image/jpeg',
      filesize: 245000,
      alt_text: altText.trim()
    });

    setUrl('');
    setFilename('');
    setAltText('');
  };

  const handleCopyUrl = (id: number, path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#111111]">
          Biblioteca Multimedia & Archivos
        </h1>
        <p className="text-xs text-[#888888] mt-1">
          Gestiona imágenes de cabecera, infografías y recursos gráficos para los artículos.
        </p>
      </div>

      {/* Add Media Box */}
      <div className="bg-white p-6 rounded-2xl border border-[#e8e8e8] shadow-sm">
        <h2 className="font-serif text-base font-bold text-[#111111] mb-4">
          + Agregar Nuevo Recurso de Imagen (URL o CDN)
        </h2>
        <form onSubmit={handleAddMedia} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-[#111111] mb-1">URL de la Imagen *</label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              required
              className="w-full px-3.5 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#111111] mb-1">Nombre Descriptivo</label>
            <input
              type="text"
              value={filename}
              onChange={e => setFilename(e.target.value)}
              placeholder="portada-energia.jpg"
              className="w-full px-3.5 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#111111] mb-1">Texto Alternativo (ALT)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={altText}
                onChange={e => setAltText(e.target.value)}
                placeholder="Descripción para SEO..."
                className="w-full px-3.5 py-2 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#2d5a27]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#2d5a27] hover:bg-[#23491f] text-white font-extrabold text-xs rounded-xl shadow transition-colors shrink-0"
              >
                Agregar
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Grid of Media */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {allMedia.map(item => (
          <div
            key={item.id}
            className="group bg-white rounded-xl border border-[#e8e8e8] overflow-hidden hover:border-[#2d5a27] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] bg-[#f7f7f7] overflow-hidden">
              <img
                src={item.filepath}
                alt={item.alt_text || item.filename}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 space-y-2">
              <p className="text-xs font-bold text-[#111111] truncate">{item.filename}</p>
              <div className="flex items-center justify-between pt-1 border-t border-[#e8e8e8]">
                <button
                  onClick={() => handleCopyUrl(item.id, item.filepath)}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#2d5a27] hover:underline"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check size={12} className="text-emerald-600" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copiar URL</span>
                    </>
                  )}
                </button>
                <a
                  href={item.filepath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-[#888888] hover:text-[#111111]"
                  title="Abrir original"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
