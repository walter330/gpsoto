import React from 'react';
import { useBlog } from '../context/BlogContext';
import { User, Twitter, Linkedin, ArrowLeft } from 'lucide-react';

export const AuthorView: React.FC<{ slug: string }> = ({ slug }) => {
  const { authors, posts, categories, setRoute } = useBlog();

  const author = authors.find(a => a.slug === slug);
  if (!author) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#111111] mb-2">Autor no encontrado</h2>
        <button
          onClick={() => setRoute({ type: 'home' })}
          className="px-6 py-2.5 bg-[#2d5a27] hover:bg-[#23491f] text-white text-xs font-bold rounded-lg transition-colors"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  const authorPosts = posts.filter(p => p.author_id === author.id && p.status === 'published');

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
    <div className="py-10 space-y-12">
      {/* Author Profile Header Box */}
      <section className="bg-[#f7f7f7] border-y border-[#e8e8e8] py-12">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 max-w-4xl">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-32 h-32 rounded-full object-cover shadow-md shrink-0 border-4 border-white"
            />
            <div className="space-y-3 text-center sm:text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#2d5a27]">
                Perfil del Redactor
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111]">
                {author.name}
              </h1>
              <p className="text-sm font-semibold text-[#888888]">{author.role_title}</p>
              <p className="text-base text-[#111111]/70 leading-relaxed pt-1">
                {author.bio}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-4 pt-3 text-xs font-bold text-[#111111]">
                <span>{authorPosts.length} artículos publicados</span>
                {author.twitter && (
                  <a
                    href={`https://twitter.com/${author.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#2d5a27] hover:underline"
                  >
                    <Twitter size={13} />
                    @{author.twitter}
                  </a>
                )}
                {author.linkedin && (
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#2d5a27] hover:underline"
                  >
                    <Linkedin size={13} />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author Articles Grid */}
      <section>
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-[#111111] border-b-2 border-[#111111] pb-3 mb-8">
            Artículos & Publicaciones de {author.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authorPosts.map(post => {
              const cat = categories.find(c => c.id === post.category_id);
              return (
                <article
                  key={post.id}
                  onClick={() => setRoute({ type: 'single', categorySlug: cat?.slug || 'general', postSlug: post.slug })}
                  className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-[#e8e8e8] hover:border-[#2d5a27] hover:shadow-md transition-all p-4 space-y-4"
                >
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#f7f7f7]">
                    <img
                      src={post.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className="absolute top-3 left-3 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow bg-[#2d5a27]"
                    >
                      {cat?.name}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-between space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#111111] leading-snug group-hover:text-[#2d5a27] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#111111]/70 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="pt-3 border-t border-[#e8e8e8] text-[11px] text-[#888888]">
                      {formatDate(post.published_at)}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
