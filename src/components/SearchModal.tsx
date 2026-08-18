import React, { useState, useEffect, useRef } from 'react';
import { useBlog } from '../context/BlogContext';
import { Search, X, ArrowRight, BookOpen } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, posts, categories, setRoute } = useBlog();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredPosts = query.trim()
    ? posts.filter(
        p =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (categorySlug: string, postSlug: string) => {
    setRoute({ type: 'single', categorySlug, postSlug });
    setIsSearchOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#111111]/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#e8e8e8] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#e8e8e8] flex items-center gap-3">
          <Search size={20} className="text-[#888888] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar noticias, análisis, autores, temas..."
            className="w-full text-base sm:text-lg text-[#111111] placeholder-[#888888] focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-[#888888] hover:text-[#111111] rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5">
          {query.trim() ? (
            filteredPosts.length > 0 ? (
              <div className="space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#888888]">
                  {filteredPosts.length} resultado{filteredPosts.length > 1 ? 's' : ''} encontrado{filteredPosts.length > 1 ? 's' : ''}
                </span>
                {filteredPosts.map(p => {
                  const cat = categories.find(c => c.id === p.category_id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelect(cat?.slug || 'general', p.slug)}
                      className="w-full text-left p-3.5 rounded-xl hover:bg-[#f7f7f7] border border-transparent hover:border-[#e8e8e8] flex gap-4 items-center group transition-all"
                    >
                      <img
                        src={p.image}
                        alt=""
                        className="w-16 h-14 rounded-lg object-cover shrink-0 border border-[#e8e8e8]"
                      />
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-[10px] font-extrabold uppercase tracking-wider block mb-1 text-[#2d5a27]"
                        >
                          {cat?.name}
                        </span>
                        <h4 className="font-serif text-sm font-bold text-[#111111] group-hover:text-[#2d5a27] transition-colors line-clamp-2">
                          {p.title}
                        </h4>
                      </div>
                      <ArrowRight size={16} className="text-[#888888] group-hover:text-[#2d5a27] transition-colors shrink-0" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <BookOpen size={36} className="mx-auto text-[#888888]/40 mb-3" />
                <p className="text-sm font-semibold text-[#111111]">No se encontraron artículos</p>
                <p className="text-xs text-[#888888] mt-1">Prueba con palabras clave más generales como 'energía', 'banca', 'IA'.</p>
              </div>
            )
          ) : (
            <div className="space-y-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#888888]">
                Secciones Editoriales
              </span>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setRoute({ type: 'category', slug: cat.slug, page: 1 });
                      setIsSearchOpen(false);
                    }}
                    className="px-3 py-1.5 bg-[#f7f7f7] hover:bg-[#e8e8e8] text-[#111111] rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#e8e8e8]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#2d5a27]" />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
