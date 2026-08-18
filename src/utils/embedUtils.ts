// Utility functions for parsing and rendering Social Media & Video Embeds (YouTube, X/Twitter, LinkedIn, Instagram, TikTok)

export interface EmbedInfo {
  type: 'youtube' | 'x' | 'linkedin' | 'instagram' | 'tiktok' | 'unknown';
  id?: string;
  url: string;
  embedUrl?: string;
  authorName?: string;
  authorHandle?: string;
  title?: string;
  caption?: string;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

export function getYouTubeEmbedUrl(urlOrId: string): string | null {
  const id = extractYouTubeId(urlOrId) || (urlOrId.length === 11 ? urlOrId : null);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
}

export function getYouTubeThumbnail(urlOrId: string, quality: 'max' | 'hq' | 'mq' = 'hq'): string | null {
  const id = extractYouTubeId(urlOrId) || (urlOrId.length === 11 ? urlOrId : null);
  if (!id) return null;
  if (quality === 'max') return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  if (quality === 'mq') return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function detectSocialPlatform(url: string): 'youtube' | 'x' | 'linkedin' | 'instagram' | 'tiktok' | 'unknown' {
  if (!url) return 'unknown';
  const clean = url.toLowerCase().trim();
  if (clean.includes('youtube.com') || clean.includes('youtu.be')) return 'youtube';
  if (clean.includes('twitter.com') || clean.includes('x.com')) return 'x';
  if (clean.includes('linkedin.com')) return 'linkedin';
  if (clean.includes('instagram.com') || clean.includes('instagr.am')) return 'instagram';
  if (clean.includes('tiktok.com')) return 'tiktok';
  return 'unknown';
}

export function generateEmbedHtml(url: string, caption?: string): string {
  const platform = detectSocialPlatform(url);
  const cleanUrl = url.trim();

  switch (platform) {
    case 'youtube': {
      const ytId = extractYouTubeId(cleanUrl);
      const embedUrl = getYouTubeEmbedUrl(cleanUrl);
      return `
<figure class="gpsoto-embed gpsoto-embed-youtube my-6" data-embed-type="youtube" data-url="${cleanUrl}" data-yt-id="${ytId || ''}">
  <div class="relative w-full aspect-video rounded-xl overflow-hidden shadow-md border border-slate-200 bg-black">
    <iframe 
      src="${embedUrl}" 
      title="${caption || 'Video de YouTube'}" 
      class="absolute inset-0 w-full h-full border-0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen
      loading="lazy"
    ></iframe>
  </div>
  ${caption ? `<figcaption class="text-xs text-slate-500 text-center mt-2 font-medium">📺 ${caption}</figcaption>` : ''}
</figure>`.trim();
    }

    case 'x': {
      return `
<div class="gpsoto-embed gpsoto-embed-x my-6" data-embed-type="x" data-url="${cleanUrl}" data-caption="${caption || ''}">
  <div class="border border-slate-200 dark:border-slate-800 bg-white rounded-2xl p-5 shadow-xs max-w-xl mx-auto font-sans">
    <div class="flex items-center justify-between gap-3 mb-3">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">𝕏</div>
        <div>
          <span class="font-bold text-sm text-slate-900 block leading-tight">Publicación en 𝕏 (Twitter)</span>
          <span class="text-xs text-slate-500 font-mono">@oficial</span>
        </div>
      </div>
      <a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-black hover:bg-slate-800 text-white text-[11px] font-bold rounded-full transition-colors flex items-center gap-1">
        <span>Ver en 𝕏</span>
      </a>
    </div>
    <p class="text-sm text-slate-800 leading-relaxed italic mb-3">
      "${caption || 'Consulta la declaración y análisis oficial publicado a través de la cuenta en 𝕏...'}"
    </p>
    <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
      <span>Enlace oficial verificado</span>
      <a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline font-semibold font-mono truncate max-w-xs">
        ${cleanUrl.replace('https://', '')}
      </a>
    </div>
  </div>
</div>`.trim();
    }

    case 'linkedin': {
      return `
<div class="gpsoto-embed gpsoto-embed-linkedin my-6" data-embed-type="linkedin" data-url="${cleanUrl}" data-caption="${caption || ''}">
  <div class="border border-blue-200 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-5 shadow-xs max-w-xl mx-auto font-sans">
    <div class="flex items-center justify-between gap-3 mb-3">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-lg bg-[#0a66c2] text-white flex items-center justify-center font-bold text-sm">in</div>
        <div>
          <span class="font-bold text-sm text-slate-900 block leading-tight">Publicación Profesional en LinkedIn</span>
          <span class="text-xs text-[#0a66c2] font-semibold">Análisis en Gestión Pública & Derecho</span>
        </div>
      </div>
      <a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-[#0a66c2] hover:bg-[#084e96] text-white text-[11px] font-bold rounded-full transition-colors flex items-center gap-1">
        <span>Ver en LinkedIn</span>
      </a>
    </div>
    <p class="text-sm text-slate-800 leading-relaxed mb-3">
      "${caption || 'Análisis técnico sobre contrataciones del Estado, integridad institucional y proyectos de infraestructura.'}"
    </p>
    <div class="pt-2 border-t border-blue-100 flex items-center justify-between text-[11px] text-slate-500">
      <span class="text-slate-600 font-medium">💼 Red Profesional</span>
      <a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-[#0a66c2] hover:underline font-semibold font-mono truncate max-w-xs">
        ${cleanUrl.replace('https://', '')}
      </a>
    </div>
  </div>
</div>`.trim();
    }

    case 'instagram': {
      return `
<div class="gpsoto-embed gpsoto-embed-instagram my-6" data-embed-type="instagram" data-url="${cleanUrl}" data-caption="${caption || ''}">
  <div class="border border-pink-200 bg-gradient-to-tr from-amber-50/30 via-pink-50/20 to-purple-50/30 rounded-2xl p-5 shadow-xs max-w-md mx-auto font-sans">
    <div class="flex items-center justify-between gap-3 mb-3">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white flex items-center justify-center font-bold text-xs shadow-xs">📸</div>
        <div>
          <span class="font-bold text-sm text-slate-900 block leading-tight">Publicación / Reel de Instagram</span>
          <span class="text-xs text-pink-700 font-semibold">@gpsoto.pe</span>
        </div>
      </div>
      <a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-gradient-to-r from-[#bc1888] to-[#cc2366] hover:opacity-90 text-white text-[11px] font-bold rounded-full transition-opacity flex items-center gap-1 shadow-xs">
        <span>Ver en Instagram</span>
      </a>
    </div>
    <div class="p-3 bg-white/80 rounded-xl border border-pink-100 mb-3">
      <p class="text-xs text-slate-700 leading-relaxed">
        ${caption || 'Fotografía y cobertura audiovisual exclusiva en Instagram.'}
      </p>
    </div>
    <div class="pt-2 border-t border-pink-100 flex items-center justify-between text-[11px] text-slate-500">
      <span>Contenido Multimedia</span>
      <a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-pink-700 hover:underline font-semibold font-mono truncate max-w-xs">
        Abrir Post ↗
      </a>
    </div>
  </div>
</div>`.trim();
    }

    case 'tiktok': {
      return `
<div class="gpsoto-embed gpsoto-embed-tiktok my-6" data-embed-type="tiktok" data-url="${cleanUrl}" data-caption="${caption || ''}">
  <div class="border border-slate-900 bg-slate-950 text-white rounded-2xl p-5 shadow-md max-w-md mx-auto font-sans">
    <div class="flex items-center justify-between gap-3 mb-3">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-black border border-cyan-400/50 text-cyan-400 flex items-center justify-center font-black text-sm shadow-xs">🎵</div>
        <div>
          <span class="font-bold text-sm text-white block leading-tight">Video Corto de TikTok</span>
          <span class="text-xs text-cyan-400 font-mono">Explicativo en 60 segundos</span>
        </div>
      </div>
      <a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-gradient-to-r from-cyan-500 to-pink-500 hover:opacity-90 text-white text-[11px] font-bold rounded-full transition-opacity flex items-center gap-1">
        <span>Ver en TikTok</span>
      </a>
    </div>
    <p class="text-xs text-slate-300 leading-relaxed mb-3">
      "${caption || 'Resumen dinámico del caso y claves jurídicas explicadas para la ciudadanía.'}"
    </p>
    <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
      <span class="flex items-center gap-1">⚡ Viral en TikTok</span>
      <a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline font-mono truncate">
        Reproducir en TikTok ↗
      </a>
    </div>
  </div>
</div>`.trim();
    }

    default:
      return `<div class="my-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"><a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline font-semibold">${cleanUrl}</a></div>`;
  }
}
