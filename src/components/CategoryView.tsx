import React from 'react';
import { useBlog } from '../context/BlogContext';
import { Folder, Clock, ArrowLeft, ArrowRight } from 'lucide-react';

export const CategoryView: React.FC<{ slug: string; page?: number }> = ({ slug, page = 1 }) => {
  const { categories, posts, authors, settings, setRoute } = useBlog();

  const category = categories.find(c => c.slug === slug);
  if (!category) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#111111] mb-2">Categoría no encontrada</h2>
        <p className="text-[#888888] mb-6">La sección que estás buscando no existe o ha sido movida.</p>
        <button
          onClick={() => setRoute({ type: 'home' })}
          className="px-6 py-2.5 bg-[#2d5a27] hover:bg-[#23491f] text-white text-xs font-bold rounded-lg transition-colors"
        >
          Volver a la Portada
        </button>
      </div>
    );
  }

  const categoryPosts = posts.filter(p => p.category_id === category.id && p.status === 'published');
  const postsPerPage = settings.posts_per_page || 6;
  const totalPages = Math.max(1, Math.ceil(categoryPosts.length / postsPerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const paginatedPosts = categoryPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const getAuthor = (id: number) => authors.find(a => a.id === id) || authors[0];

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="py-8 space-y-10">
      {/* Category Header Banner */}
      <section className="border-b border-[#e8e8e8] pb-8">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2d5a27] uppercase tracking-widest mb-3">
            <Folder size={14} />
            <span>Sección Editorial</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] mb-4">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-base sm:text-lg text-[#111111]/70 max-w-3xl leading-relaxed">
              {category.description}
            </p>
          )}

          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-[#f7f7f7] rounded-full text-[#888888] border border-[#e8e8e8]">
            <span>{categoryPosts.length} artículos en total</span>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section>
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          {paginatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map(post => {
                const auth = getAuthor(post.author_id);
                return (
                  <article
                    key={post.id}
                    onClick={() => setRoute({ type: 'single', categorySlug: category.slug, postSlug: post.slug })}
                    className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-[#e8e8e8] hover:border-[#2d5a27] hover:shadow-md transition-all p-4 space-y-4"
                  >
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#f7f7f7]">
                      <img
                        src={post.image}
                        alt={post.image_alt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <h2 className="font-serif text-lg sm:text-xl font-bold text-[#111111] leading-snug group-hover:text-[#2d5a27] transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#111111]/70 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#e8e8e8] flex items-center justify-between text-[11px] text-[#888888]">
                        <span className="font-semibold text-[#111111]">{auth.name}</span>
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center text-[#888888]">
              No hay artículos publicados en esta categoría todavía.
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 pt-8 border-t border-[#e8e8e8] flex items-center justify-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setRoute({ type: 'category', slug: category.slug, page: currentPage - 1 })}
                className="px-3.5 py-2 rounded-lg border border-[#e8e8e8] text-[#111111] hover:bg-[#f7f7f7] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-bold"
              >
                <ArrowLeft size={14} />
                Anterior
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => (
                  <button
                    key={pNum}
                    onClick={() => setRoute({ type: 'category', slug: category.slug, page: pNum })}
                    className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors ${
                      pNum === currentPage
                        ? 'bg-[#2d5a27] text-white'
                        : 'bg-white border border-[#e8e8e8] text-[#111111] hover:bg-[#f7f7f7]'
                    }`}
                  >
                    {pNum}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setRoute({ type: 'category', slug: category.slug, page: currentPage + 1 })}
                className="px-3.5 py-2 rounded-lg border border-[#e8e8e8] text-[#111111] hover:bg-[#f7f7f7] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-bold"
              >
                Siguiente
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
