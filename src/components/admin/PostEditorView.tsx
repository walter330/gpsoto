import React, { useState, useEffect } from 'react';
import { useBlog } from '../../context/BlogContext';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Image as ImageIcon, 
  Globe, 
  Sparkles, 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Code,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  Layers,
  Search,
  Share2,
  Youtube,
  Linkedin,
  Instagram,
  Play
} from 'lucide-react';
import { SocialEmbedModal } from './SocialEmbedModal';
import { extractYouTubeId, getYouTubeThumbnail } from '../../utils/embedUtils';

export const PostEditorView: React.FC<{ editId?: number }> = ({ editId }) => {
  const { posts, categories, authors, savePost, setRoute } = useBlog();
  const isEditing = Boolean(editId && editId > 0);
  const existing = editId ? posts.find(p => p.id === editId) : null;

  const [title, setTitle] = useState(existing?.title || '');
  const [slug, setSlug] = useState(existing?.slug || '');
  const [categoryId, setCategoryId] = useState<number>(existing?.category_id || categories[0]?.id || 1);
  const [authorId, setAuthorId] = useState<number>(existing?.author_id || authors[0]?.id || 1);
  const [excerpt, setExcerpt] = useState(existing?.excerpt || '');
  const [content, setContent] = useState(
    existing?.content ||
      '<p>Escribe aquí el cuerpo del artículo con información periodística de calidad...</p><h2>Subtítulo de análisis</h2><p>Desarrollo de los puntos clave del acontecimiento.</p>'
  );
  const [image, setImage] = useState(
    existing?.image ||
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'
  );
  const [imageAlt, setImageAlt] = useState(existing?.image_alt || '');
  const [youtubeUrl, setYoutubeUrl] = useState(existing?.youtube_url || '');
  const [isHero, setIsHero] = useState<boolean>(existing?.is_hero || false);
  const [isFeatured, setIsFeatured] = useState<boolean>(existing?.is_featured || false);
  const [status, setStatus] = useState<'published' | 'draft'>(existing?.status || 'published');
  const [publishedAt, setPublishedAt] = useState<string>(
    existing?.published_at ? existing.published_at.slice(0, 16) : new Date().toISOString().slice(0, 16)
  );
  const [focusKeyword, setFocusKeyword] = useState('Manuel Francisco Soto Gamboa');
  const [seoTitle, setSeoTitle] = useState(existing?.seo_title || '');
  const [metaDescription, setMetaDescription] = useState(existing?.meta_description || '');
  const [canonicalUrl, setCanonicalUrl] = useState(existing?.canonical_url || '');
  const [robots, setRobots] = useState(existing?.robots || 'index, follow');
  const [schemaType, setSchemaType] = useState(existing?.seo?.schema_type || 'NewsArticle');

  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [editingPermalink, setEditingPermalink] = useState(false);

  // Auto-generate slug when title changes if creating new
  const handleTitleBlur = () => {
    if (!slug && title) {
      const generated = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('El título es obligatorio.');
      return;
    }

    const cleanSlug = (slug.trim() || title)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const currentCat = categories.find(c => c.id === categoryId);
    const calculatedCanonical = canonicalUrl.trim() || `https://gpsoto.com/${currentCat?.slug || 'opinion'}/${cleanSlug}/`;

    savePost({
      id: isEditing ? editId : undefined,
      title: title.trim(),
      slug: cleanSlug,
      category_id: categoryId,
      author_id: authorId,
      excerpt: excerpt.trim(),
      content: content,
      image: image.trim(),
      image_alt: imageAlt.trim() || title.trim(),
      youtube_url: youtubeUrl.trim() || undefined,
      has_video: Boolean(youtubeUrl.trim()),
      is_hero: isHero,
      is_featured: isFeatured,
      status: status,
      published_at: new Date(publishedAt).toISOString(),
      seo_title: seoTitle.trim() || title.trim(),
      meta_description: metaDescription.trim() || excerpt.trim(),
      canonical_url: calculatedCanonical,
      robots: robots,
      seo: {
        meta_title: seoTitle.trim() || title.trim(),
        meta_description: metaDescription.trim() || excerpt.trim(),
        focus_keywords: focusKeyword.trim(),
        canonical_url: calculatedCanonical,
        schema_type: schemaType,
        og_image: image.trim()
      }
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setRoute({ type: 'admin', subview: 'posts' });
    }, 900);
  };

  const executeCommand = (tag: string) => {
    if (tag === 'h2') {
      setContent(prev => prev + '\n<h2>Subtítulo de Sección</h2>\n<p>Texto explicativo...</p>');
    } else if (tag === 'h3') {
      setContent(prev => prev + '\n<h3>Punto Secundario</h3>\n<p>Detalle adicional...</p>');
    } else if (tag === 'blockquote') {
      setContent(prev => prev + '\n<blockquote>"Cita textual destacada de la fuente o entrevistado."</blockquote>\n');
    } else if (tag === 'ul') {
      setContent(prev => prev + '\n<ul>\n  <li>Elemento de lista destacado 1</li>\n  <li>Elemento de lista destacado 2</li>\n</ul>\n');
    } else if (tag === 'link') {
      const url = prompt('Ingresa la URL del enlace:');
      if (url) {
        setContent(prev => prev + ` <a href="${url}" target="_blank" rel="noopener">enlace de referencia</a> `);
      }
    } else if (tag === 'bold') {
      setContent(prev => prev + ' <strong>texto en negrita</strong> ');
    } else if (tag === 'italic') {
      setContent(prev => prev + ' <em>texto en cursiva</em> ');
    }
  };

  const selectedCategory = categories.find(c => c.id === categoryId);
  const cascadeUrlPreview = `https://gpsoto.com/${selectedCategory?.slug || 'opinion'}/${slug || 'url-noticia'}/`;

  // Live SEO Score calculation
  const titleChars = (seoTitle || title).length;
  const descChars = (metaDescription || excerpt).length;
  const hasKeywordInTitle = focusKeyword && (seoTitle || title).toLowerCase().includes(focusKeyword.toLowerCase());
  const hasImage = Boolean(image);
  const hasGoodLength = titleChars >= 35 && titleChars <= 65;
  const hasGoodDesc = descChars >= 100 && descChars <= 165;
  
  let calculatedScore = 50;
  if (hasGoodLength) calculatedScore += 15;
  if (hasGoodDesc) calculatedScore += 15;
  if (hasKeywordInTitle) calculatedScore += 10;
  if (hasImage) calculatedScore += 10;

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRoute({ type: 'admin', subview: 'posts' })}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg shadow-2xs"
          >
            <ArrowLeft size={14} />
            Volver a Entradas
          </button>
          <span className="text-sm font-bold text-slate-800">
            {isEditing ? 'Editar Entrada' : 'Añadir Nueva Entrada'}
          </span>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1">
            <CheckCircle2 size={14} className="text-emerald-600" />
            ¡Entrada guardada en la base de datos!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Primary Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Content Box */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Título de la Entrada <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                placeholder="Añade un título..."
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-lg sm:text-xl font-bold text-slate-900 focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
              />
            </div>

            {/* WordPress Cascading Permalink Bar */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 font-mono text-slate-600 text-[11px] overflow-hidden">
                <span className="font-sans font-bold text-slate-500">Enlace permanente:</span>
                <span className="text-slate-400">https://gpsoto.com/{selectedCategory?.slug || 'opinion'}/</span>
                {editingPermalink ? (
                  <input
                    type="text"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    className="px-2 py-0.5 bg-white border border-blue-400 rounded text-blue-800 font-bold focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span className="font-bold text-[#1e40af]">{slug || 'titulo-de-la-nota'}</span>
                )}
                <span className="text-slate-400">/</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPermalink(!editingPermalink)}
                  className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-bold text-slate-700"
                >
                  {editingPermalink ? 'OK' : 'Editar'}
                </button>
                {existing && (
                  <button
                    type="button"
                    onClick={() => setRoute({ type: 'single', categorySlug: selectedCategory?.slug || 'general', postSlug: slug })}
                    className="p-1 text-slate-500 hover:text-[#1e40af]"
                    title="Ver entrada en vivo"
                  >
                    <ExternalLink size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Custom Rich Visual Toolbar & Content Area */}
            <div>
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                {/* Classic WP Toolbar */}
                <div className="bg-slate-100 p-2 border-b border-slate-300 flex flex-wrap items-center gap-1 text-xs font-bold text-slate-700">
                  <button
                    type="button"
                    onClick={() => executeCommand('h2')}
                    className="p-1.5 px-2 bg-white hover:bg-slate-200 rounded border border-slate-300 flex items-center gap-1"
                    title="Encabezado 2"
                  >
                    <Heading2 size={13} /> H2
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('h3')}
                    className="p-1.5 px-2 bg-white hover:bg-slate-200 rounded border border-slate-300 flex items-center gap-1"
                    title="Encabezado 3"
                  >
                    <Heading3 size={13} /> H3
                  </button>
                  <span className="w-px h-4 bg-slate-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => executeCommand('bold')}
                    className="p-1.5 bg-white hover:bg-slate-200 rounded border border-slate-300"
                    title="Negrita"
                  >
                    <Bold size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('italic')}
                    className="p-1.5 bg-white hover:bg-slate-200 rounded border border-slate-300"
                    title="Cursiva"
                  >
                    <Italic size={13} />
                  </button>
                  <span className="w-px h-4 bg-slate-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => executeCommand('ul')}
                    className="p-1.5 bg-white hover:bg-slate-200 rounded border border-slate-300"
                    title="Lista con viñetas"
                  >
                    <List size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('blockquote')}
                    className="p-1.5 bg-white hover:bg-slate-200 rounded border border-slate-300"
                    title="Bloque de cita"
                  >
                    <Quote size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('link')}
                    className="p-1.5 bg-white hover:bg-slate-200 rounded border border-slate-300"
                    title="Insertar enlace"
                  >
                    <LinkIcon size={13} />
                  </button>

                  <span className="w-px h-4 bg-slate-300 mx-1" />

                  {/* Social Embed Button */}
                  <button
                    type="button"
                    onClick={() => setIsEmbedModalOpen(true)}
                    className="p-1.5 px-2.5 bg-gradient-to-r from-red-600 via-slate-900 to-[#0a66c2] text-white hover:opacity-90 rounded border border-slate-300 flex items-center gap-1.5 text-xs font-bold shadow-2xs"
                    title="Insertar Video o Red Social (YouTube, X, LinkedIn, Instagram, TikTok)"
                  >
                    <Share2 size={13} />
                    <span>+ Embeber Red Social / Video</span>
                  </button>

                  <div className="ml-auto">
                    <button
                      type="button"
                      onClick={() => setIsHtmlMode(!isHtmlMode)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                        isHtmlMode
                          ? 'bg-[#1d2327] text-white border-[#1d2327]'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {isHtmlMode ? 'Editor Visual' : 'Editor HTML'}
                    </button>
                  </div>
                </div>

                {/* Editor textarea */}
                {isHtmlMode ? (
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={14}
                    className="w-full p-4 text-xs font-mono bg-slate-900 text-slate-100 focus:outline-none"
                  />
                ) : (
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={14}
                    className="w-full p-4 text-sm text-slate-800 focus:outline-none leading-relaxed font-serif"
                    placeholder="Comienza a escribir o pega el texto aquí..."
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Extracto (Resumen que aparecerá en portadas y buscadores)
              </label>
              <textarea
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Escribe un extracto opcional..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#2271b1]"
              />
            </div>
          </div>

          {/* Rank Math / Yoast WordPress SEO Meta Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-[#1e40af]" />
                <h3 className="font-bold text-sm text-slate-800">
                  Rank Math / Yoast SEO & Schemas
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Puntuación SEO:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                  calculatedScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {calculatedScore} / 100
                </span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Google SERP Snippet Preview */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Vista Previa en Resultados de Búsqueda de Google (SERP):
                </span>
                <div className="text-xs text-slate-500 font-mono truncate">
                  {cascadeUrlPreview}
                </div>
                <div className="text-base text-[#1a0dab] font-medium hover:underline cursor-pointer line-clamp-1 font-sans">
                  {seoTitle || title || 'Manuel Francisco Soto Gamboa | Título SEO'} - GPSOTO
                </div>
                <div className="text-xs text-slate-600 line-clamp-2">
                  {metaDescription || excerpt || 'Meta descripción del artículo con palabras clave estratégicas para indexación rápida.'}
                </div>
              </div>

              {/* Focus Keyword */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Palabra Clave Principal (Focus Keyword)
                </label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={e => setFocusKeyword(e.target.value)}
                  placeholder="Ej. Manuel Francisco Soto Gamboa, gestión pública"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#2271b1]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Título SEO
                    </label>
                    <span className={`text-[10px] ${titleChars > 60 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                      {titleChars} / 60 car.
                    </span>
                  </div>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={e => setSeoTitle(e.target.value)}
                    placeholder="Título optimizado para Google..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#2271b1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tipo de Schema.org JSON-LD
                  </label>
                  <select
                    value={schemaType}
                    onChange={e => setSchemaType(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
                  >
                    <option value="NewsArticle">NewsArticle (Noticia Periodística Google News)</option>
                    <option value="Article">Article (Artículo General)</option>
                    <option value="BlogPosting">BlogPosting (Publicación de Blog)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Meta Descripción SEO
                  </label>
                  <span className={`text-[10px] ${descChars > 160 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                    {descChars} / 160 car.
                  </span>
                </div>
                <textarea
                  value={metaDescription}
                  onChange={e => setMetaDescription(e.target.value)}
                  rows={2}
                  placeholder="Descripción persuasiva que incita al clic en buscadores..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#2271b1]"
                />
              </div>

              {/* SEO Checklist */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                <span className="font-bold text-slate-700 block">Checklist de Auditoría SEO:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {hasKeywordInTitle ? (
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle size={13} className="text-amber-500 shrink-0" />
                    )}
                    <span className={hasKeywordInTitle ? 'text-slate-800' : 'text-amber-700'}>
                      Palabra clave en el título
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {hasGoodLength ? (
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle size={13} className="text-amber-500 shrink-0" />
                    )}
                    <span className={hasGoodLength ? 'text-slate-800' : 'text-slate-500'}>
                      Longitud de título adecuada
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {hasGoodDesc ? (
                      <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle size={13} className="text-amber-500 shrink-0" />
                    )}
                    <span className={hasGoodDesc ? 'text-slate-800' : 'text-slate-500'}>
                      Meta descripción óptima
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span className="text-slate-800">
                      Schema {schemaType} activo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (4 Cols) - WordPress Meta Boxes */}
        <div className="lg:col-span-4 space-y-5">
          {/* Publish Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800">
              Publicar
            </div>

            <div className="p-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Estado:</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-none"
                >
                  <option value="published">Publicada</option>
                  <option value="draft">Borrador</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  Publicación:
                </label>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={e => setPublishedAt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none"
                >
                </input>
              </div>

              {/* Flags */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isHero}
                    onChange={e => setIsHero(e.target.checked)}
                    className="rounded text-[#1e40af] focus:ring-0 w-4 h-4"
                  />
                  <span>Fijar como Portada Principal (Hero)</span>
                </label>

                <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={e => setIsFeatured(e.target.checked)}
                    className="rounded text-[#1e40af] focus:ring-0 w-4 h-4"
                  />
                  <span>Destacar en sección superior</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setRoute({ type: 'admin', subview: 'posts' })}
                  className="text-xs text-red-600 hover:underline font-semibold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#2271b1] hover:bg-[#135e96] text-white font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Save size={14} />
                  {isEditing ? 'Actualizar' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>

          {/* Category Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800 flex items-center justify-between">
              <span>Categorías</span>
              <button
                type="button"
                onClick={() => setRoute({ type: 'admin', subview: 'categories' })}
                className="text-[11px] text-[#2271b1] hover:underline"
              >
                + Nueva
              </button>
            </div>
            <div className="p-4 max-h-48 overflow-y-auto space-y-2 text-xs">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer text-slate-700">
                  <input
                    type="radio"
                    name="categorySelection"
                    checked={categoryId === cat.id}
                    onChange={() => setCategoryId(cat.id)}
                    className="text-[#1e40af] focus:ring-0"
                  />
                  <span className="font-semibold">{cat.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({cat.slug})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Author Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800">
              Autor
            </div>
            <div className="p-4 text-xs">
              <select
                value={authorId}
                onChange={e => setAuthorId(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-none"
              >
                {authors.map(auth => (
                  <option key={auth.id} value={auth.id}>
                    {auth.name} ({auth.role_title})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured Image Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <ImageIcon size={14} className="text-[#1e40af]" />
              <span>Imagen Destacada</span>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">URL de la Imagen:</label>
                <input
                  type="url"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="https://..."
                  required
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Texto ALT (Para accesibilidad y SEO de imágenes):
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={e => setImageAlt(e.target.value)}
                  placeholder="Descripción precisa de la imagen..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#2271b1]"
                />
              </div>

              {/* Preview */}
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                {image ? (
                  <img src={image} alt="Vista previa" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    Sin imagen
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* YouTube Video Metabox */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-red-50 border-b border-red-200 font-bold text-xs text-red-900 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Youtube size={15} className="text-red-600" />
                <span>Video de YouTube (Portada y Cabecera)</span>
              </div>
              <span className="text-[10px] bg-red-200 text-red-800 px-1.5 py-0.5 rounded font-mono font-bold">
                Opcional
              </span>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  URL del Video de YouTube:
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={e => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-red-500 font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Si completas este campo, la nota se mostrará con reproductor de video en la sección de multimedia de la Portada y en la nota.
                </p>
              </div>

              {/* YouTube Thumbnail Preview */}
              {youtubeUrl && extractYouTubeId(youtubeUrl) && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-600 block">Previsualización de Video:</span>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-300 group">
                    <img 
                      src={getYouTubeThumbnail(youtubeUrl, 'hq') || image} 
                      alt="Miniatura YouTube" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                        <Play size={14} className="ml-0.5 fill-white" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Social Media & Video Embed Modal */}
      <SocialEmbedModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        onInsert={html => setContent(prev => prev + '\n\n' + html + '\n\n<p></p>')}
      />
    </div>
  );
};

