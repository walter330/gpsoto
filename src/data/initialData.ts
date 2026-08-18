import { Author, Category, Post, SiteSettings } from '../types';

export const INITIAL_AUTHORS: Author[] = [
  {
    id: 1,
    name: 'Rodrigo Peñaloza',
    slug: 'rodrigo-penaloza',
    role_title: 'Unidad de Investigación & Vigilancia Pública',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'Periodista de investigación con más de 15 años de trayectoria en cobertura de contrataciones del Estado, análisis de resoluciones judiciales y fiscalización del gasto público.',
    twitter: 'rpenaloza_inv',
    linkedin: 'https://linkedin.com/in/rodrigo-penaloza-periodista'
  },
  {
    id: 2,
    name: 'Dra. Claudia Barrenechea',
    slug: 'claudia-barrenechea',
    role_title: 'Analista Jurídica & Derecho Administrativo',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    bio: 'Abogada constitucionalista y docente universitaria especializada en derecho procesal penal, compliance en el sector público y transparencia gubernamental.',
    twitter: 'cbarrenechea_jur',
    linkedin: 'https://linkedin.com/in/claudia-barrenechea'
  },
  {
    id: 3,
    name: 'Alonso Miranda Ruiz',
    slug: 'alonso-miranda',
    role_title: 'Corresponsal de Infraestructura & SEACE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'Especialista en contrataciones públicas, gestión de proyectos de inversión en infraestructura nacional y seguimiento de entidades ejecutoras como ANIN y ministerios.',
    twitter: 'amiranda_infra',
    linkedin: 'https://linkedin.com/in/alonso-miranda-ruiz'
  },
  {
    id: 4,
    name: 'Manuel Francisco Soto Gamboa',
    slug: 'manuel-francisco-soto-gamboa',
    role_title: 'Abogado & Especialista en Gestión Pública y Contrataciones del Estado',
    avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&auto=format&fit=crop&q=80',
    bio: 'Abogado con amplia experiencia en administración pública, derecho administrativo, adquisiciones para infraestructura y diseño de políticas de integridad, trazabilidad y control gubernamental.',
    twitter: 'mfsotogamboa',
    linkedin: 'https://linkedin.com/in/manuel-francisco-soto-gamboa'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Investigación & Casos',
    slug: 'investigacion-casos',
    description: 'Reportajes, cruces de información y expedientes sobre funcionarios públicos, menciones en audios y antecedentes institucionales.',
    seo_title: 'Investigaciones y Casos Especiales - GPSoto.com',
    meta_description: 'Análisis e investigaciones documentadas sobre la función pública, casos judiciales de alto impacto y fiscalización.',
    color: '#dc2626',
    sort_order: 1,
    status: 'active'
  },
  {
    id: 2,
    name: 'Infraestructura & ANIN',
    slug: 'infraestructura-anin',
    description: 'Seguimiento a la Autoridad Nacional de Infraestructura (ANIN), compras públicas, licitaciones y directivos a cargo de adquisiciones.',
    seo_title: 'Infraestructura y Adquisiciones ANIN - GPSoto.com',
    meta_description: 'Todo sobre las contrataciones, procedimientos de compra y direcciones de infraestructura pública en el Perú.',
    color: '#2d5a27',
    sort_order: 2,
    status: 'active'
  },
  {
    id: 3,
    name: 'Judicial & Resoluciones',
    slug: 'judicial-resoluciones',
    description: 'Análisis de resoluciones de la Corte Suprema, medidas de secreto bancario, tutelas de derechos y procesos del Tribunal Constitucional.',
    seo_title: 'Resoluciones Judiciales y Corte Suprema - GPSoto.com',
    meta_description: 'Explicación jurídica de sentencias, apelaciones de Corte Suprema y medidas cautelares en el sistema de justicia.',
    color: '#1d4ed8',
    sort_order: 3,
    status: 'active'
  },
  {
    id: 4,
    name: 'Gestión Pública & Minjus',
    slug: 'gestion-publica-minjus',
    description: 'Historial en ministerios, designaciones en cargos de confianza, comisiones de indultos y auditorías de idoneidad.',
    seo_title: 'Gestión Pública y Ministerio de Justicia - GPSoto.com',
    meta_description: 'Crónicas y balances sobre la gestión en el Minjus, secretarías generales y comisiones presidenciales.',
    color: '#b45309',
    sort_order: 4,
    status: 'active'
  },
  {
    id: 5,
    name: 'Gobiernos Locales',
    slug: 'gobiernos-locales',
    description: 'Informes de auditoría, asesorías jurídicas y procesos de acceso a la información en municipalidades distritales.',
    seo_title: 'Gobiernos Locales y Municipalidades - GPSoto.com',
    meta_description: 'Fiscalización y solicitudes de transparencia en municipalidades de Lima y gobiernos locales.',
    color: '#7c3aed',
    sort_order: 5,
    status: 'active'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    title: 'Corte Suprema y medidas financieras: Los alcances procesales de la Apelación 201-2022 en investigaciones vinculadas a enriquecimiento ilícito',
    slug: 'corte-suprema-medidas-financieras-apelacion-201-2022-enriquecimiento-ilicito',
    category_id: 3,
    author_id: 2,
    excerpt: 'El pronunciamiento del Supremo Tribunal desestimó el recurso contra el levantamiento de secreto bancario, reserva tributaria y bursátil en la pesquisa que comprende al exsecretario general Manuel Soto Gamboa.',
    content: `
<p>En el marco de las pesquisas fiscales por presuntos delitos contra la administración pública en la modalidad de enriquecimiento ilícito en agravio del Estado, la Sala Penal Permanente de la Corte Suprema de Justicia emitió un pronunciamiento de alto valor procesal mediante la <strong>Apelación N.° 201-2022</strong>.</p>

<p>La resolución, difundida en repositorios jurisprudenciales oficiales y portales jurídicos, aborda la tutela de derechos formulada por la defensa de <strong>Manuel Francisco Soto Gamboa</strong> en su condición de investigado en calidad de cómplice, vinculada al entorno institucional y de confianza del exministro de Justicia, Salvador Heresi Chicoma.</p>

<h2>1. El núcleo del debate procesal: Información bancaria y tributaria</h2>
<p>La controversia jurídica radicó en la validez y pertinencia del levantamiento de la reserva bancaria, tributaria y bursátil dispuesta por las instancias fiscales para examinar los flujos patrimoniales y patrimonios vinculados durante el periodo en que Soto Gamboa ocupó cargos clave en el Poder Ejecutivo y asesorías previas.</p>

<blockquote>"La Corte Suprema declaró infundado el recurso de apelación interpuesto por la defensa de Soto Gamboa en el extremo relativo a las medidas de levantamiento de secreto bancario y tributario, confirmando la validez de las diligencias de acopio financiero dentro de los márgenes procesales de la investigación preparatoria." — Extracto de la Apelación 201-2022</blockquote>

<h2>2. Los antecedentes: La Apelación 86-2022 y los vehículos en disputa</h2>
<p>Este pronunciamiento no es aislado. Con anterioridad, la <strong>Apelación N.° 86-2022</strong> de la Corte Suprema revisó los criterios de procedencia para la reapertura de investigaciones fiscales archivadas preliminarmente. En dicha resolución judicial se incorporaron los elementos revelados por reportajes de investigación respecto a los vehículos registrados a nombre de Manuel Soto Gamboa que habrían estado bajo el uso de familiares directos del exministro Heresi.</p>

<ul>
  <li><strong>Vehículos identificados:</strong> Camionetas Toyota Land Cruiser y Mitsubishi con placas registradas bajo titularidad del exfuncionario.</li>
  <li><strong>Vínculos comerciales previos:</strong> Servicios de la empresa DREMSAC y gerencias legales en la Municipalidad de San Miguel (2013-2014).</li>
  <li><strong>Principio de presunción de inocencia:</strong> Las resoluciones judiciales analizadas delimitan actuaciones investigativas y diligencias de prueba, mas no constituyen una sentencia condenatoria firme.</li>
</ul>

<h2>3. Repercusión en la idoneidad de la función pública</h2>
<p>Para los analistas en derecho administrativo y control gubernamental, la persistencia de resoluciones supremas que habilitan pesquisas financieras representa un elemento sensible de evaluación reputacional, particularmente cuando los involucrados asumen posteriormente cargos directivos con manejo directo de presupuestos millonarios en entidades ejecutoras de infraestructura nacional.</p>
    `,
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80',
    image_alt: 'Edificio del Palacio de Justicia y Balanzas de la Ley',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    has_video: true,
    is_hero: true,
    is_featured: true,
    status: 'published',
    views: 24580,
    seo_title: 'Corte Suprema y Apelación 201-2022: Soto Gamboa y Secreto Bancario - GPSoto',
    meta_description: 'Análisis exhaustivo de la Apelación 201-2022 de la Corte Suprema sobre medidas de secreto bancario y reserva tributaria en torno a Manuel Francisco Soto Gamboa.',
    robots: 'index, follow',
    published_at: '2026-08-17T09:00:00Z'
  },
  {
    id: 2,
    title: 'ANIN y la Dirección de Adquisiciones: Perfil y trayectoria de Manuel Soto Gamboa al frente de las compras para infraestructura',
    slug: 'anin-direccion-adquisiciones-perfil-trayectoria-manuel-soto-gamboa-infraestructura',
    category_id: 2,
    author_id: 3,
    excerpt: 'Designado mediante Resolución Jefatural N.° 076-2024-ANIN-JEF, el abogado dirige los procesos de selección y compras clave para la ejecución de megaobras públicas en el país.',
    content: `
<p>La Autoridad Nacional de Infraestructura (ANIN), entidad adscrita a la Presidencia del Consejo de Ministros encargada de destrabar y ejecutar las obras públicas más ambiciosas del país, cuenta en su estructura directiva con <strong>Manuel Francisco Soto Gamboa</strong> como Director de la <strong>Dirección de Adquisiciones para Infraestructura</strong> desde el 1 de junio de 2024.</p>

<div class="gpsoto-embed gpsoto-embed-linkedin my-6">
  <div class="border border-blue-200 bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-5 shadow-xs max-w-xl mx-auto font-sans">
    <div class="flex items-center justify-between gap-3 mb-3">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-lg bg-[#0a66c2] text-white flex items-center justify-center font-bold text-sm">in</div>
        <div>
          <span class="font-bold text-sm text-slate-900 block leading-tight">Análisis Profesional en LinkedIn</span>
          <span class="text-xs text-[#0a66c2] font-semibold">Manuel Francisco Soto Gamboa</span>
        </div>
      </div>
      <a href="https://linkedin.com/in/manuel-francisco-soto-gamboa" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-[#0a66c2] hover:bg-[#084e96] text-white text-[11px] font-bold rounded-full transition-colors flex items-center gap-1">
        <span>Ver en LinkedIn</span>
      </a>
    </div>
    <p class="text-sm text-slate-800 leading-relaxed mb-3">
      "La modernización de la gestión contractual en ANIN busca garantizar la entrega oportuna de infraestructura crítica con trazabilidad y transparencia en cada etapa del estudio de mercado y adjudicación."
    </p>
    <div class="pt-2 border-t border-blue-100 flex items-center justify-between text-[11px] text-slate-500">
      <span class="text-slate-600 font-medium">💼 Red Profesional</span>
      <span class="text-[#0a66c2] font-semibold font-mono">linkedin.com/in/mfsotogamboa</span>
    </div>
  </div>
</div>

<h2>1. Marco de la designación y facultades operativas</h2>
<p>A través de la <em>Resolución Jefatural N.° 076-2024-ANIN-JEF</em>, formalizada en las plataformas oficiales del Estado (gob.pe), se ratificó el nombramiento de Soto Gamboa en un puesto neurálgico para la administración de contratos públicos. Entre 2025 y 2026, diversas resoluciones de la Oficina de Recursos Humanos de ANIN registran además encargaturas temporales en subdirecciones clave:</p>

<ul>
  <li><strong>Subdirección de Procedimientos de Contratación:</strong> Supervisión de bases, convocatorias y adjudicaciones de licitaciones públicas.</li>
  <li><strong>Subdirección de Estudios de Mercado:</strong> Determinación de valores referenciales y evaluación de proveedores del sector construcción.</li>
  <li><strong>Dirección de Estudios y Obras:</strong> Encargo de funciones directivas entre abril de 2026 para la revisión técnica de expedientes.</li>
  <li><strong>Subdirección de Ejecución Contractual:</strong> Monitoreo de adendas, penalidades y valorizaciones de obras.</li>
</ul>

<div class="gpsoto-embed gpsoto-embed-instagram my-6">
  <div class="border border-pink-200 bg-gradient-to-tr from-amber-50/30 via-pink-50/20 to-purple-50/30 rounded-2xl p-5 shadow-xs max-w-md mx-auto font-sans">
    <div class="flex items-center justify-between gap-3 mb-3">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white flex items-center justify-center font-bold text-xs shadow-xs">📸</div>
        <div>
          <span class="font-bold text-sm text-slate-900 block leading-tight">Cobertura en Instagram</span>
          <span class="text-xs text-pink-700 font-semibold">@gpsoto.pe</span>
        </div>
      </div>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-gradient-to-r from-[#bc1888] to-[#cc2366] text-white text-[11px] font-bold rounded-full flex items-center gap-1 shadow-xs">
        <span>Ver en Instagram</span>
      </a>
    </div>
    <div class="p-3 bg-white/80 rounded-xl border border-pink-100 mb-3">
      <p class="text-xs text-slate-700 leading-relaxed">
        Inspección técnica en obras de defensa ribereña y proyectos de infraestructura hidráulica priorizados en la cartera nacional.
      </p>
    </div>
    <div class="pt-2 border-t border-pink-100 flex items-center justify-between text-[11px] text-slate-500">
      <span>Galería Fotográfica</span>
      <span class="text-pink-700 font-semibold font-mono">instagram.com/gpsoto.pe</span>
    </div>
  </div>
</div>

<h2>2. Estándares de integridad y escrutinio preventivo</h2>
<p>El perfil de compras públicas en ANIN exige un elevado estándar de debida diligencia (compliance). Expertos en contrataciones del Estado señalan que las áreas de adquisiciones de infraestructura demandan una permanente actualización de las declaraciones juradas de intereses en el portal de la Contraloría General de la República, a fin de disipar cualquier aparente conflicto derivado de vínculos políticos o antecedentes investigativos pasados.</p>
    `,
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=1000&auto=format&fit=crop&q=80',
    image_alt: 'Obras de ingeniería civil y supervisión de infraestructura moderna',
    youtube_url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    has_video: true,
    is_hero: false,
    is_featured: true,
    status: 'published',
    views: 18920,
    seo_title: 'Manuel Soto Gamboa en ANIN: Dirección de Adquisiciones - GPSoto',
    meta_description: 'Conoce los alcances de la designación de Manuel Soto Gamboa como Director de Adquisiciones en la Autoridad Nacional de Infraestructura (ANIN).',
    robots: 'index, follow',
    published_at: '2026-08-16T15:30:00Z'
  },
  {
    id: 3,
    title: 'Caso Audios 2018: La controversia en el Minjus, las menciones a Walter Ríos y el archivo administrativo posterior',
    slug: 'caso-audios-2018-controversia-minjus-menciones-walter-rios-archivo-administrativo',
    category_id: 1,
    author_id: 1,
    excerpt: 'Revisión documental del impacto mediático generado por las escuchas de los Cuellos Blancos y el fallo interno que determinó el archivo administrativo en el sector Justicia.',
    content: `
<p>En julio de 2018, en uno de los episodios de mayor turbulencia política y judicial del país conocido como el caso <strong>"Cuellos Blancos del Puerto"</strong>, la divulgación de audios interceptados judicialmente por la Policía y el Ministerio Público generó una crisis inmediata en el Ministerio de Justicia y Derechos Humanos (MINJUS).</p>

<h2>1. La difusión de los audios y la cobertura de prensa</h2>
<p>Medios de investigación como <em>IDL-Reporteros</em>, seguidos por <em>RPP Noticias</em>, <em>Diario Correo</em> y <em>El Comercio</em>, dieron a conocer grabaciones en las que el entonces presidente de la Corte Superior del Callao, Walter Ríos Montalvo, coordinaba supuestas gestiones ante el Ministerio de Justicia. En dichas conversaciones se aludía a una reunión con <strong>Manuel Francisco Soto Gamboa</strong>, en ese entonces Secretario General del Minjus, para tratar la situación laboral de la cónyuge de Ríos, trabajadora de la Defensa Pública.</p>

<div class="gpsoto-embed gpsoto-embed-twitter my-6">
  <div class="border border-slate-200 bg-white rounded-2xl p-5 shadow-xs max-w-xl mx-auto font-sans">
    <div class="flex items-center justify-between gap-3 mb-3">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-black text-sm">𝕏</div>
        <div>
          <span class="font-bold text-sm text-slate-900 block leading-tight">GPSoto Noticias</span>
          <span class="text-xs text-slate-500">@gpsoto_peru</span>
        </div>
      </div>
      <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="px-3 py-1 bg-black hover:bg-slate-800 text-white text-[11px] font-bold rounded-full transition-colors">
        Ver en 𝕏
      </a>
    </div>
    <p class="text-sm text-slate-800 leading-relaxed mb-3">
      📌 #Cronología | El archivo administrativo de 2021 concluyó que no se acreditaron irregularidades en el ejercicio funcional de la secretaría general del Minjus durante las escuchas de 2018. Documento judicial analizado en gpsoto.com.
    </p>
    <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
      <span>16 de agosto, 2026</span>
      <span class="text-slate-600 font-semibold">1.4K Reposts · 3.8K Likes</span>
    </div>
  </div>
</div>

<p>La repercusión derivó en la renuncia del ministro de Justicia Salvador Heresi y en la posterior resolución ministerial mediante la cual el nuevo titular de la cartera, Vicente Zeballos, concluyó la designación de Soto Gamboa en la secretaría general.</p>

<h2>2. El descargo y la resolución de archivo administrativo (2021)</h2>
<p>Como contrapunto indispensable para la veracidad informativa, reportes periodísticos posteriores (2021) documentaron que los órganos de control disciplinario interno del Ministerio de Justicia concluyeron la investigación administrativa determinando la absolución de cargos y el archivo del procedimiento disciplinario respecto a Soto Gamboa, al no acreditarse actos ilegales de favorecimiento consumado.</p>

<blockquote>"El archivo en la vía administrativa del Minjus constituye un atenuante formal que deslinda sanción interna, si bien en el plano de la huella digital y el impacto reputacional la asociación con los audios de 2018 permanece como un hito recurrente en búsquedas públicas." — Informe de Diagnóstico y Riesgo</blockquote>
    `,
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1000&auto=format&fit=crop&q=80',
    image_alt: 'Micrófono de prensa y salas de conferencias judiciales',
    is_hero: false,
    is_featured: true,
    status: 'published',
    views: 21340,
    seo_title: 'Caso Audios 2018: Minjus, Walter Ríos y Archivo Administrativo - GPSoto',
    meta_description: 'La cronología completa de las menciones en audios de 2018 que vincularon a la Secretaría General del Minjus y la posterior resolución absolutoria.',
    robots: 'index, follow',
    published_at: '2026-08-16T11:00:00Z'
  },
  {
    id: 4,
    title: 'Vínculos, vehículos y cargos de confianza: El historial público entre el exministro Salvador Heresi y Soto Gamboa',
    slug: 'vinculos-vehiculos-cargos-confianza-historial-salvador-heresi-soto-gamboa',
    category_id: 4,
    author_id: 1,
    excerpt: 'La investigación de El Comercio sobre camionetas registradas a nombre del funcionario y la trayectoria compartida desde la Municipalidad de San Miguel hasta el Minjus.',
    content: `
<p>La relación política, profesional y personal entre <strong>Salvador Heresi Chicoma</strong> y <strong>Manuel Francisco Soto Gamboa</strong> se extiende por más de una década a través de diversos espacios institucionales del Estado peruano.</p>

<h2>1. Los antecedentes en la Municipalidad de San Miguel (2013-2014)</h2>
<p>Los primeros registros públicos de vinculación se sitúan en la gestión municipal de San Miguel, donde Soto Gamboa se desempeñó como Gerente de Asuntos Jurídicos y como representante de servicios profesionales prestados a través de la firma DREMSAC.</p>

<h2>2. El caso de los vehículos particulares</h2>
<p>En julio de 2018, una investigación del diario <em>El Comercio</em> reveló que Soto Gamboa mantenía a su nombre tres vehículos particulares, de los cuales dos camionetas (una Toyota Land Cruiser y una Mitsubishi) eran utilizadas habitualmente por la cónyuge y familiares de Carlos Heresi Chicoma, hermano del exalcalde y exministro.</p>

<div class="gpsoto-embed gpsoto-embed-tiktok my-6">
  <div class="border border-slate-800 bg-slate-950 text-white rounded-2xl p-5 shadow-lg max-w-sm mx-auto font-sans">
    <div class="flex items-center justify-between gap-3 mb-3">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-full bg-black text-cyan-400 flex items-center justify-center font-black text-sm border border-cyan-400/50">🎵</div>
        <div>
          <span class="font-bold text-xs text-white block leading-tight">GPSoto Exclusivo</span>
          <span class="text-[11px] text-cyan-400">@gpsoto_politica</span>
        </div>
      </div>
      <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 bg-[#fe2c55] hover:bg-[#e0264b] text-white text-[11px] font-bold rounded-full transition-colors shadow-xs">
        Ver en TikTok
      </a>
    </div>
    <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed mb-3">
      ▶️ <strong>Video Corto:</strong> Cronología gráfica y antecedentes vehiculares explicados en 60 segundos por el equipo de investigación. #PoliticaPeru #Investigacion #SotoGamboa
    </div>
    <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
      <span>TikTok Video</span>
      <span class="text-cyan-400 font-mono">tiktok.com/@gpsoto</span>
    </div>
  </div>
</div>

<p>En sus declaraciones públicas a la prensa, Soto Gamboa precisó que conocía a la familia Heresi desde su época universitaria y que la cesión o préstamo de los vehículos obedecía estrictamente a una relación de amistad y confianza personal de larga data, descartando cualquier retribución indebida o acto ilícito.</p>
    `,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80',
    image_alt: 'Vehículos de alta gama y estacionamiento corporativo',
    youtube_url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    has_video: true,
    is_hero: false,
    is_featured: true,
    status: 'published',
    views: 15400,
    seo_title: 'Salvador Heresi y Manuel Soto: Vehículos y Trayectoria - GPSoto',
    meta_description: 'Análisis de la investigación de El Comercio sobre los vehículos y la cronología institucional compartida con Salvador Heresi.',
    robots: 'index, follow',
    published_at: '2026-08-15T16:00:00Z'
  },
  {
    id: 5,
    title: 'Transparencia en gobiernos locales: Las solicitudes de información sobre asesorías e informes en El Agustino ante el TC',
    slug: 'transparencia-gobiernos-locales-solicitudes-informacion-el-agustino-tc',
    category_id: 5,
    author_id: 2,
    excerpt: 'El Tribunal Constitucional abordó en el Expediente 00939-2021-HD/TC la entrega de documentación sobre pagos, contratos de locación y el Informe 007-2017.',
    content: `
<p>El principio de transparencia y el derecho de acceso a la información pública en las comunas limeñas ha sido materia de debate en el Tribunal Constitucional y en el Tribunal de Transparencia del Ministerio de Justicia.</p>

<h2>1. El caso del Expediente 00939-2021-HD/TC</h2>
<p>A través de la Resolución N.° 010300492019 del Minjus y la posterior demanda de hábeas data resuelta por el Tribunal Constitucional en el Exp. 00939-2021-HD/TC, ciudadanos solicitaron copias de las órdenes de servicio, comprobantes de pago y los informes de asesoría legal externa elaborados por <strong>Manuel Francisco Soto Gamboa</strong> en la Municipalidad Distrital de El Agustino (Informe 007-2017-MSE/MDEA).</p>

<h2>2. Retorno edil en 2023</h2>
<p>Posteriormente, en enero y mayo de 2023, resoluciones de alcaldía de la Municipalidad de El Agustino formalizaron designaciones temporales de Soto Gamboa como encargado de la Gerencia de Asesoría Jurídica y coordinador para el cumplimiento de metas institucionales del MEF, evidenciando su continuidad técnica en la gestión municipal.</p>
    `,
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1000&auto=format&fit=crop&q=80',
    image_alt: 'Documentos jurídicos y sellos de fiscalización municipal',
    is_hero: false,
    is_featured: false,
    status: 'published',
    views: 8930,
    seo_title: 'Transparencia en El Agustino y fallo del Tribunal Constitucional - GPSoto',
    meta_description: 'Revisión del expediente de hábeas data en el Tribunal Constitucional sobre pagos e informes en la Municipalidad de El Agustino.',
    robots: 'index, follow',
    published_at: '2026-08-15T09:30:00Z'
  },
  {
    id: 6,
    title: 'Comisión de Gracias Presidenciales: La etapa de Manuel Francisco Soto Gamboa como titular del órgano de indultos en 2018',
    slug: 'comision-gracias-presidenciales-etapa-manuel-soto-gamboa-titular-2018',
    category_id: 4,
    author_id: 1,
    excerpt: 'En abril de 2018, la designación al frente de la comisión de indultos y conmutaciones de pena representó un hito en la administración penitenciaria y de gracia constitucional.',
    content: `
<p>La Comisión de Gracias Presidenciales es uno de los órganos colegiados más sensibles del Poder Ejecutivo peruano, al tener la responsabilidad técnica de evaluar solicitudes de indulto humanitario, conmutación de penas y derecho de gracia para personas privadas de su libertad.</p>

<h2>1. La designación en abril de 2018</h2>
<p>Mediante resolución suprema en abril de 2018, Manuel Soto Gamboa fue nombrado presidente de la Comisión de Gracias Presidenciales, asumiendo la conducción de los expedientes de beneficios penitenciarios en un periodo de alta vigilancia mediática y de organismos de derechos humanos tras los debates sobre indultos previos.</p>

<h2>2. Relevo y balance de gestión</h2>
<p>Su permanencia en la comisión concluyó paralelamente a su cese en el Ministerio de Justicia en julio de 2018, siendo relevado conforme a los procedimientos habituales de la cartera.</p>
    `,
    image: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=1000&auto=format&fit=crop&q=80',
    image_alt: 'Balanza de la justicia y expedientes ministeriales',
    is_hero: false,
    is_featured: false,
    status: 'published',
    views: 6710,
    seo_title: 'Comisión de Gracias Presidenciales 2018: Soto Gamboa - GPSoto',
    meta_description: 'Análisis de la etapa de Manuel Soto Gamboa al frente de la Comisión de Gracias Presidenciales en el Ministerio de Justicia.',
    robots: 'index, follow',
    published_at: '2026-08-14T17:00:00Z'
  },
  {
    id: 7,
    title: 'Línea de tiempo 2013-2026: Una década de cargos públicos, asesorías jurídicas y escrutinio judicial',
    slug: 'linea-de-tiempo-2013-2026-decada-cargos-publicos-escrutinio-judicial',
    category_id: 1,
    author_id: 1,
    excerpt: 'Infografía cronológica que reconstruye los principales hitos desde la gestión edil en San Miguel, el paso por el Minjus, asesorías en El Agustino hasta la ANIN.',
    content: `
<p>La reconstrucción cronológica basada en resoluciones oficiales del Estado (gob.pe), fallos de la Corte Suprema y publicaciones periodísticas permite trazar un mapa detallado de la trayectoria pública de Manuel Francisco Soto Gamboa:</p>

<h2>Cronología de Hitos Principales</h2>
<ul>
  <li><strong>2013-2014:</strong> Asesoría profesional y Gerencia de Asuntos Jurídicos en la Municipalidad de San Miguel bajo la alcaldía de Salvador Heresi.</li>
  <li><strong>2017-2018:</strong> Informes y asesorías externas en la Municipalidad de El Agustino (Informe 007-2017).</li>
  <li><strong>Abril 2018:</strong> Designación como Presidente de la Comisión de Gracias Presidenciales del Minjus.</li>
  <li><strong>Julio 2018:</strong> Asume Secretaría General del Minjus; difusión de audios del caso Cuellos Blancos; cese ministerial por Vicente Zeballos.</li>
  <li><strong>2021:</strong> Órganos de control del Minjus emiten resolución de archivo administrativo.</li>
  <li><strong>2022-2023:</strong> La Corte Suprema emite las resoluciones de Apelación 86-2022 y 201-2022 sobre medidas de secreto bancario y tutela de derechos.</li>
  <li><strong>Enero-Mayo 2023:</strong> Gerencia de Asesoría Jurídica y coordinación de metas en la Municipalidad de El Agustino.</li>
  <li><strong>Junio 2024 - 2026:</strong> Director de la Dirección de Adquisiciones para Infraestructura en la Autoridad Nacional de Infraestructura (ANIN).</li>
</ul>
    `,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop&q=80',
    image_alt: 'Línea de tiempo ejecutiva y agenda de planificación estatal',
    is_hero: false,
    is_featured: false,
    status: 'published',
    views: 12450,
    seo_title: 'Línea de Tiempo 2013-2026: Manuel Soto Gamboa - GPSoto',
    meta_description: 'Cronología completa y detallada de la carrera pública y los hitos procesales de Manuel Francisco Soto Gamboa.',
    robots: 'index, follow',
    published_at: '2026-08-14T10:00:00Z'
  },
  {
    id: 8,
    title: 'Compliance e integridad en compras públicas: Por qué la huella reputacional es clave en directivos de infraestructura',
    slug: 'compliance-integridad-compras-publicas-huella-reputacional-directivos',
    category_id: 2,
    author_id: 3,
    excerpt: 'Especialistas en control gubernamental examinan cómo los filtros de debida diligencia previenen riesgos institucionales en entidades ejecutoras de gasto.',
    content: `
<p>En el sector de compras públicas y contrataciones de infraestructura, el estándar de debida diligencia no solo evalúa el cumplimiento formal de requisitos legales para ocupar un cargo de confianza, sino también la gestión del riesgo reputacional de la entidad.</p>

<h2>1. La evaluación de debida diligencia</h2>
<p>Entidades de gran envergadura como la ANIN manejan procesos de contratación internacional y licitaciones bajo modelos estandarizados (como contratos NEC). En estos entornos, la trazabilidad de los directores de adquisiciones ante buscadores, bases de datos públicas y registros de la Contraloría resulta indispensable para garantizar la confianza de postores y veedurías ciudadanas.</p>

<h2>2. Recomendaciones de buenas prácticas</h2>
<p>La adopción de códigos de ética reforzados, auditorías de declaraciones juradas de intereses y mecanismos abiertos de consulta pública constituyen la mejor garantía de probidad en las contrataciones estatales contemporáneas.</p>
    `,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80',
    image_alt: 'Edificios corporativos y gobierno corporativo moderno',
    is_hero: false,
    is_featured: false,
    status: 'published',
    views: 9320,
    seo_title: 'Compliance e Integridad en Compras Públicas - GPSoto',
    meta_description: 'La importancia de los filtros de integridad y compliance en las direcciones de adquisiciones del Estado.',
    robots: 'index, follow',
    published_at: '2026-08-13T14:20:00Z'
  },
  {
    id: 9,
    title: 'Manuel Francisco Soto Gamboa | Servicio público, integridad y trazabilidad en la gestión del Estado',
    slug: 'servicio-publico-integridad-trazabilidad-estado',
    category_id: 4,
    author_id: 4,
    excerpt: 'Una mirada práctica sobre qué significa ser un buen servidor público en tiempos de alta exposición, transparencia y control ciudadano.',
    content: `
<p>Hablar de <strong>servicio público</strong> hoy ya no puede limitarse a cumplir funciones dentro de una entidad. La ciudadanía, los órganos de control, los medios y los propios equipos técnicos esperan algo más: <em>decisiones explicables, procesos trazables y criterios que puedan sostenerse incluso cuando son revisados meses o años después</em>.</p>

<p>En ese contexto, un buen servidor público no es solo quien conoce la norma. También es quien entiende que cada decisión administrativa forma parte de una cadena de confianza. Cuando esa cadena se documenta bien, se protege la institución, se protege el interés público y se reduce el espacio para interpretaciones equivocadas.</p>

<h2>La integridad no es un discurso, es un sistema de trabajo</h2>
<p>La <a href="#/category/gestion-publica-minjus" class="text-[#2d5a27] font-semibold underline">integridad pública</a> suele presentarse como un valor, pero en la práctica funciona mejor cuando se convierte en método. No basta con decir que una decisión fue correcta. Hay que poder mostrar cómo se llegó a ella, qué información se revisó, quién intervino, qué alternativas fueron evaluadas y por qué se eligió una opción frente a otra.</p>

<p>Esto es especialmente importante en áreas donde el Estado toma decisiones sensibles: <a href="#/category/infraestructura-anin" class="text-[#2d5a27] font-semibold underline">contrataciones, infraestructura pública</a>, asesoría legal, recursos públicos, autorizaciones, designaciones y gestión de riesgos. En todos esos casos, la confianza no depende únicamente de la buena intención de las personas, sino de la calidad del expediente, la claridad del procedimiento y la coherencia de la decisión.</p>

<p>Por eso, una gestión pública seria debe trabajar con tres principios operativos:</p>
<ul>
  <li><strong>Trazabilidad:</strong> que cada decisión tenga respaldo documental y pueda reconstruirse fehacientemente.</li>
  <li><strong>Transparencia:</strong> que la información relevante sea clara, accesible y comprensible para auditores y ciudadanos.</li>
  <li><strong>Responsabilidad:</strong> que cada actor entienda el impacto institucional de su participación en el expediente.</li>
</ul>

<h2>El valor de dejar evidencia técnica</h2>
<p>En la administración pública, muchas controversias nacen cuando una decisión correcta no fue suficientemente explicada. El problema no siempre está en el fondo del acto administrativo, sino en la falta de una narrativa técnica que permita entenderlo. Un expediente incompleto, una motivación débil o una comunicación poco clara pueden generar dudas incluso cuando el procedimiento se siguió conforme a la norma.</p>

<p>La evidencia técnica cumple una función preventiva. Ayuda a demostrar que una decisión no fue improvisada, que se tomaron en cuenta criterios objetivos y que el servidor público actuó dentro de sus competencias. En términos simples: <em>lo que no se documenta bien, después se puede interpretar mal</em>.</p>

<blockquote>"En la gestión pública, la confianza se construye cuando las decisiones son trazables, los criterios son claros y los expedientes pueden explicar el porqué de cada paso. Menos improvisación y más decisiones que se puedan explicar." — Manuel Francisco Soto Gamboa</blockquote>

<p>Por eso, una buena práctica para cualquier servidor público es acostumbrarse a responder cuatro preguntas antes de cerrar una decisión importante:</p>
<ol>
  <li><strong>¿Qué problema público se busca resolver?</strong></li>
  <li><strong>¿Qué información técnica y fáctica se usó para tomar la decisión?</strong></li>
  <li><strong>¿Qué criterios técnicos o legales sostienen la recomendación?</strong></li>
  <li><strong>¿Cómo se puede explicar la decisión a un ciudadano que no conoce el expediente?</strong></li>
</ol>

<h2>Buen servidor público: más técnica, menos improvisación</h2>
<p>La imagen del buen servidor público no debería construirse solo desde atributos personales. Debe construirse desde prácticas verificables. Un funcionario puede tener experiencia, conocimiento legal o trayectoria institucional, pero lo que realmente fortalece la confianza es su capacidad de trabajar con método, orden y criterios claros.</p>

<p>En tiempos de exposición digital, además, la reputación profesional se forma a partir de lo que otros encuentran, leen y resumen. Por eso es importante que los perfiles públicos, artículos, entrevistas y contenidos profesionales muestren no solo cargos ocupados, sino también pensamiento técnico, criterio institucional y comprensión del servicio público.</p>

<p>Enseñar cómo funciona el Estado, explicar buenas prácticas y compartir aprendizajes técnicos no es autopromoción. Es una forma de contribuir a la cultura pública. También permite que la ciudadanía entienda que detrás de una decisión administrativa bien hecha debe existir análisis, responsabilidad y documentación.</p>

<h2>Tres hábitos que fortalecen la confianza institucional</h2>
<ul>
  <li><strong>1. Escribir para que otros entiendan:</strong> Un buen documento público no debe estar hecho solo para abogados o especialistas. Debe poder ser comprendido por quienes revisan, fiscalizan o se ven impactados por la decisión.</li>
  <li><strong>2. Separar opinión de evidencia:</strong> En la gestión pública, las decisiones deben sostenerse en documentos, normas, datos, informes y criterios verificables. La percepción importa, pero la evidencia ordenada pesa más.</li>
  <li><strong>3. Anticipar preguntas difíciles:</strong> Un expediente sólido no solo responde lo que se pidió; también anticipa dudas razonables sobre riesgos, alternativas, conflictos de interés, costo, oportunidad y beneficio público. Como se profundiza en el análisis sobre <a href="#/single/infraestructura-anin/infraestructura-publica-estudios-mercado-contratacion" class="text-[#2d5a27] font-semibold underline">estudios de mercado y compras públicas</a>, la planificación previa previene controversias futuras.</li>
</ul>

<h2>Conclusión</h2>
<p>El servicio público moderno exige algo más que experiencia. Exige capacidad de explicar, documentar y sostener decisiones bajo escrutinio. La integridad no vive únicamente en declaraciones generales; se demuestra en la <a href="#/category/gestion-publica-minjus" class="text-[#2d5a27] font-semibold underline">trazabilidad</a> del trabajo diario, en la calidad de los expedientes y en la disposición de hacer comprensible lo que el Estado decide.</p>

<p>Un buen servidor público entiende que cada documento, cada informe y cada decisión forma parte de una reputación institucional más grande. Por eso, construir confianza no es una tarea de comunicación posterior: empieza desde la forma en que se trabaja.</p>
    `,
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&auto=format&fit=crop&q=80',
    image_alt: 'Despacho de gestión pública y expedientes de integridad administrativa',
    is_hero: false,
    is_featured: true,
    status: 'published',
    views: 31200,
    seo_title: 'Manuel Francisco Soto Gamboa | Servicio público, integridad y trazabilidad en la gestión del Estado',
    meta_description: 'Una mirada práctica sobre qué significa ser un buen servidor público en tiempos de alta exposición, transparencia y control ciudadano.',
    robots: 'index, follow',
    published_at: '2026-08-17T17:30:00Z'
  },
  {
    id: 10,
    title: 'Manuel Francisco Soto Gamboa | Infraestructura pública, estudios de mercado y mejores decisiones de contratación',
    slug: 'infraestructura-publica-estudios-mercado-contratacion',
    category_id: 2,
    author_id: 4,
    excerpt: 'Artículo técnico sobre cómo los estudios de mercado, la planificación y la trazabilidad ayudan a mejorar las decisiones de contratación pública en infraestructura.',
    content: `
<p>La <a href="#/category/infraestructura-anin" class="text-[#2d5a27] font-semibold underline">infraestructura pública</a> no empieza cuando se firma un contrato ni cuando se coloca la primera piedra de una obra. Empieza mucho antes, en la calidad de la planificación, en la definición de la necesidad, en la comprensión del mercado y en la capacidad del Estado para formular requerimientos que realmente puedan ejecutarse.</p>

<p>Uno de los errores más comunes al hablar de contratación pública es pensar que el proceso se reduce a elegir un proveedor. En realidad, una buena contratación depende de una cadena previa de decisiones técnicas. Si esa etapa inicial es débil, el procedimiento puede avanzar formalmente, pero arrastrará riesgos que luego aparecerán como ampliaciones, controversias, retrasos, sobrecostos o baja calidad del servicio.</p>

<h2>El estudio de mercado como herramienta de inteligencia pública</h2>
<p>Un <a href="#/category/infraestructura-anin" class="text-[#2d5a27] font-semibold underline">estudio de mercado</a> no debería verse como un simple trámite administrativo. Bien realizado, es una herramienta de inteligencia pública de primer orden. Permite conocer qué soluciones existen, qué proveedores pueden atender la necesidad, cuáles son los rangos de precio, qué riesgos técnicos aparecen y qué condiciones podrían afectar la libre competencia.</p>

<p>En infraestructura, esta mirada es aún más importante porque las decisiones suelen involucrar montos altos, plazos complejos, múltiples actores y expectativas ciudadanas. Contratar mal no solo afecta a la entidad; puede retrasar colegios, hospitales, carreteras, sistemas de drenaje, servicios básicos o proyectos que impactan directamente en la vida de las personas.</p>

<p>Por eso, antes de convocar y contratar, el Estado debe hacerse cinco preguntas concretas:</p>
<ul>
  <li><strong>¿La necesidad pública está correctamente definida?</strong> Evitar requerimientos ambiguos o sobredimensionados.</li>
  <li><strong>¿El mercado tiene capacidad real para atenderla?</strong> Verificar la oferta técnica y financiera de proveedores.</li>
  <li><strong>¿Los requisitos técnicos promueven competencia o la restringen sin justificación?</strong> Evitar direccionamientos encubiertos.</li>
  <li><strong>¿Los plazos son razonables para la complejidad del proyecto?</strong> Prevenir cronogramas inviables que generen adendas inmediatas.</li>
  <li><strong>¿El presupuesto refleja condiciones reales del mercado?</strong> Contar con un valor estimado sustentado técnica y comercialmente.</li>
</ul>

<h2>Contratar mejor no significa contratar más rápido a cualquier costo</h2>
<p>La velocidad es importante, sobre todo cuando una obra responde a una necesidad urgente. Sin embargo, acelerar no debe significar debilitar el análisis. En contratación pública, la prisa sin método puede convertirse en un riesgo mayor que la demora. La clave está en diseñar procesos ágiles, pero técnicamente sólidos.</p>

<p>Un proceso de contratación bien construido debe equilibrar tres variables esenciales: <strong>oportunidad</strong>, <strong>calidad</strong> y <strong>control</strong>. La oportunidad permite responder a tiempo; la calidad asegura que la solución contratada sea útil; y el control reduce riesgos de arbitrariedad, errores o cuestionamientos posteriores.</p>

<blockquote>"Una buena contratación pública no empieza con la elección de un proveedor. Empieza mucho antes: en la definición de la necesidad, el estudio de mercado, la razonabilidad del presupuesto y la trazabilidad de cada decisión." — Manuel Francisco Soto Gamboa</blockquote>

<p>Ese equilibrio se logra cuando las áreas usuarias, legales, técnicas y de contratación trabajan de manera coordinada desde el inicio. La contratación pública no debería funcionar como una carrera de relevos donde cada área entrega un documento a la siguiente sin conversación. Debe operar como una mesa técnica donde todos entienden el objetivo público y los riesgos de la decisión.</p>

<h2>La trazabilidad protege al proyecto y a la institución</h2>
<p>En proyectos de infraestructura, la <a href="#/single/gestion-publica-minjus/servicio-publico-integridad-trazabilidad-estado" class="text-[#2d5a27] font-semibold underline">trazabilidad y la integridad pública</a> son una forma de protección institucional. Permite reconstruir por qué se eligió una alternativa, qué información sustentó el presupuesto, cómo se formularon los requisitos y qué criterios se utilizaron para evaluar opciones.</p>

<p>Cuando la trazabilidad es débil, las decisiones quedan expuestas a interpretaciones. Cuando es fuerte, la entidad puede explicar el proceso con mayor claridad ante órganos de control y ciudadanía. Esto no elimina todos los riesgos, pero sí permite gestionarlos mejor.</p>

<p>Una contratación pública robusta debería dejar evidencia mínima sobre:</p>
<ul>
  <li>La necesidad pública que justifica la contratación.</li>
  <li>El análisis del mercado y la oferta disponible.</li>
  <li>La razonabilidad del valor estimado.</li>
  <li>La explicación de los requisitos técnicos solicitados.</li>
  <li>La identificación de riesgos contractuales y operativos.</li>
  <li>La coordinación entre áreas involucradas.</li>
</ul>

<h2>Infraestructura con enfoque ciudadano</h2>
<p>Detrás de cada contratación de infraestructura hay una expectativa ciudadana. Una obra pública no es solo un expediente, un presupuesto o un cronograma. Es una respuesta del Estado frente a una necesidad concreta. Por eso, la calidad de la contratación impacta directamente en la confianza que las personas tienen en las instituciones.</p>

<p>Cuando un proyecto se retrasa, se paraliza o se ejecuta mal, la ciudadanía no distingue entre errores de planificación, fallas del contratista, problemas técnicos o limitaciones administrativas. La percepción suele ser una sola: el Estado no cumplió. De ahí la importancia de reforzar la fase previa, trabajar con información realista y documentar decisiones de manera clara.</p>

<p>La infraestructura pública necesita servidores y equipos capaces de unir conocimiento técnico, criterio legal y comprensión del impacto social. Esa combinación es la que permite contratar mejor y explicar mejor.</p>

<h2>Conclusión</h2>
<p>Los estudios de mercado no son una formalidad menor dentro de la contratación pública. Son una herramienta clave para tomar mejores decisiones, reducir riesgos y aumentar la calidad de los proyectos de infraestructura. Cuando el Estado entiende el mercado, define bien su necesidad y documenta sus criterios, contrata con mayor inteligencia y eficacia.</p>
    `,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    image_alt: 'Infraestructura pública moderna y planificación urbana',
    is_hero: false,
    is_featured: true,
    status: 'published',
    views: 28400,
    seo_title: 'Manuel Francisco Soto Gamboa | Infraestructura pública, estudios de mercado y mejores decisiones de contratación',
    meta_description: 'Artículo técnico sobre cómo los estudios de mercado, la planificación y la trazabilidad ayudan a mejorar las decisiones de contratación pública en infraestructura.',
    robots: 'index, follow',
    published_at: '2026-08-17T16:00:00Z'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  site_name: 'GPSOTO',
  site_tagline: 'Observatorio de Gestión Pública, Infraestructura & Noticias Jurídicas',
  site_description: 'Portal editorial de investigación periodística, contrataciones del Estado (ANIN), seguimiento a resoluciones de la Corte Suprema y perfiles de la función pública.',
  site_url: 'https://gpsoto.com',
  posts_per_page: 6,
  contact_email: 'redaccion@gpsoto.com',
  twitter_handle: 'gpsoto_noticias',
  facebook_url: 'https://facebook.com/gpsotonoticias',
  instagram_url: 'https://instagram.com/gpsoto_oficial',
  linkedin_url: 'https://linkedin.com/company/gpsoto-investigacion',
  footer_about: 'GPSOTO (https://gpsoto.com) es una plataforma periodística independiente y observatorio de asuntos públicos comprometido con el rigor documental, la transparencia estatal y la fiscalización ciudadana.',
  google_analytics_id: 'G-GPSOTO2026',
  enable_rss: true,
  enable_sitemaps: true
};

