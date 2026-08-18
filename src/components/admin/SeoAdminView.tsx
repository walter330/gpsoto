import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Globe, FileCode2, Rss, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';

export const SeoAdminView: React.FC = () => {
  const { settings, posts, categories, authors } = useBlog();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const siteUrl = settings.site_url || 'https://tudominio.com';

  const generateSitemapXml = () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Portada Principal -->
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
${categories
  .map(
    c => `  <!-- Sección: ${c.name} -->
  <url>
    <loc>${siteUrl}/${c.slug}/</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
${posts
  .filter(p => p.status === 'published')
  .map(p => {
    const cat = categories.find(c => c.id === p.category_id);
    return `  <!-- Artículo: ${p.title} -->
  <url>
    <loc>${siteUrl}/${cat?.slug || 'articulos'}/${p.slug}/</loc>
    <lastmod>${p.published_at.slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p.is_hero ? '0.9' : p.is_featured ? '0.8' : '0.7'}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;
  };

  const generateRssXml = () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${settings.site_name}</title>
    <link>${siteUrl}</link>
    <description>${settings.site_description}</description>
    <language>es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${posts
  .filter(p => p.status === 'published')
  .slice(0, 10)
  .map(p => {
    const cat = categories.find(c => c.id === p.category_id);
    const auth = authors.find(a => a.id === p.author_id);
    return `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${siteUrl}/${cat?.slug || 'articulos'}/${p.slug}/</link>
      <guid isPermaLink="true">${siteUrl}/${cat?.slug || 'articulos'}/${p.slug}/</guid>
      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
      <category><![CDATA[${cat?.name}]]></category>
      <author>${auth?.name}</author>
      <description><![CDATA[${p.excerpt}]]></description>
    </item>`;
  })
  .join('\n')}
  </channel>
</rss>`;
  };

  const handleCopy = (type: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#111111]">
          Optimización SEO Técnica, Sitemaps & Feeds RSS
        </h1>
        <p className="text-xs text-[#888888] mt-1">
          Generador dinámico de Sitemaps XML para Google Search Console y Feeds RSS 2.0 listos para indexación en servidores PHP.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sitemap XML Box */}
        <div className="bg-white p-6 rounded-2xl border border-[#e8e8e8] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-3">
            <div className="flex items-center gap-2">
              <FileCode2 size={18} className="text-[#2d5a27]" />
              <h2 className="font-serif text-base font-bold text-[#111111]">sitemap.xml (Google Search Console)</h2>
            </div>
            <button
              onClick={() => handleCopy('sitemap', generateSitemapXml())}
              className="flex items-center gap-1 text-xs font-bold text-[#2d5a27] hover:underline"
            >
              {copiedType === 'sitemap' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copiedType === 'sitemap' ? 'Copiado' : 'Copiar XML'}</span>
            </button>
          </div>

          <p className="text-xs text-[#888888]">
            Estructura estandarizada con prioridades y frecuencias de rastreo para indexar portada, secciones y artículos.
          </p>

          <pre className="p-4 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-[11px] font-mono text-[#111111] overflow-x-auto max-h-60">
            {generateSitemapXml()}
          </pre>
        </div>

        {/* RSS Feed Box */}
        <div className="bg-white p-6 rounded-2xl border border-[#e8e8e8] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-3">
            <div className="flex items-center gap-2">
              <Rss size={18} className="text-[#2d5a27]" />
              <h2 className="font-serif text-base font-bold text-[#111111]">feed.xml / rss.php (Sindicación RSS 2.0)</h2>
            </div>
            <button
              onClick={() => handleCopy('rss', generateRssXml())}
              className="flex items-center gap-1 text-xs font-bold text-[#2d5a27] hover:underline"
            >
              {copiedType === 'rss' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copiedType === 'rss' ? 'Copiado' : 'Copiar RSS'}</span>
            </button>
          </div>

          <p className="text-xs text-[#888888]">
            Canal RSS compatible con lectores de noticias, agregadores como Feedly y servicios de newsletter automáticos.
          </p>

          <pre className="p-4 bg-[#f7f7f7] border border-[#e8e8e8] rounded-xl text-[11px] font-mono text-[#111111] overflow-x-auto max-h-60">
            {generateRssXml()}
          </pre>
        </div>
      </div>

      {/* Schema.org Article & Organization structured data info */}
      <div className="bg-white p-6 rounded-2xl border border-[#e8e8e8] shadow-sm space-y-4">
        <h2 className="font-serif text-base font-bold text-[#111111] flex items-center gap-2">
          <Sparkles size={16} className="text-[#2d5a27]" />
          Datos Estructurados Schema.org (JSON-LD)
        </h2>
        <p className="text-xs text-[#888888] leading-relaxed">
          Cada artículo generado por el sistema incluye marcado automático <code>schema.org/NewsArticle</code>, con campos de autor <code>Person</code>, editor <code>NewsMediaOrganization</code>, imágenes en alta resolución, y fechas <code>datePublished</code> y <code>dateModified</code> en formato ISO 8601 para maximizar la presencia en <em>Google News</em> y <em>Google Discover</em>.
        </p>
      </div>
    </div>
  );
};
