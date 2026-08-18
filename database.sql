-- ====================================================================
-- EDITORIAL NEWS & BLOG CMS - MYSQL DATABASE SCHEMA
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB 10.3+
-- ====================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table: users (Administrators & Editors)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `role` ENUM('admin', 'editor') NOT NULL DEFAULT 'admin',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: authors (Editorial authors with bios & social)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `authors` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `role_title` VARCHAR(120) DEFAULT 'Redactor Editorial',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `twitter` VARCHAR(100) DEFAULT NULL,
  `linkedin` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_authors_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: categories (Content categories)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `seo_title` VARCHAR(160) DEFAULT NULL,
  `meta_description` VARCHAR(255) DEFAULT NULL,
  `color` VARCHAR(20) DEFAULT '#0284c7',
  `sort_order` INT NOT NULL DEFAULT 0,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_categories_slug` (`slug`),
  KEY `idx_categories_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: posts (Articles & News stories)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `posts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `author_id` INT UNSIGNED NOT NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `image_alt` VARCHAR(255) DEFAULT NULL,
  `is_hero` TINYINT(1) NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `status` ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  `views` INT UNSIGNED NOT NULL DEFAULT 0,
  `seo_title` VARCHAR(160) DEFAULT NULL,
  `meta_description` VARCHAR(255) DEFAULT NULL,
  `canonical_url` VARCHAR(255) DEFAULT NULL,
  `robots` VARCHAR(50) NOT NULL DEFAULT 'index, follow',
  `published_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_posts_cat_slug` (`category_id`, `slug`),
  KEY `idx_posts_slug` (`slug`),
  KEY `idx_posts_status_published` (`status`, `published_at`),
  KEY `idx_posts_hero` (`is_hero`),
  KEY `idx_posts_featured` (`is_featured`),
  CONSTRAINT `fk_posts_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_posts_author` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: media (Uploaded media library)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `media` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `filename` VARCHAR(255) NOT NULL,
  `filepath` VARCHAR(255) NOT NULL,
  `filetype` VARCHAR(50) NOT NULL,
  `filesize` INT UNSIGNED NOT NULL,
  `alt_text` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: settings (Key-value site settings)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `settings` (
  `setting_key` VARCHAR(60) NOT NULL,
  `setting_value` TEXT DEFAULT NULL,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- DEFAULT SEED DATA
-- --------------------------------------------------------

-- Default Admin User (Password: admin123)
-- Hash generated using password_hash('admin123', PASSWORD_BCRYPT)
INSERT INTO `users` (`id`, `username`, `email`, `password`, `name`, `role`) VALUES
(1, 'admin', 'admin@editorial.com', '$2y$10$eA.XQG/VbC5t29E9P/8ZyeHnI2LreZl.gE49n81u6Xv1wRqmIq.K2', 'Director Editorial', 'admin')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- Default Authors
INSERT INTO `authors` (`id`, `name`, `slug`, `role_title`, `avatar`, `bio`, `twitter`, `linkedin`) VALUES
(1, 'Elena Rostova', 'elena-rostova', 'Editora en Jefe & Especialista en Salud', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80', 'Periodista con más de 12 años de trayectoria cubriendo nutrición científica, estilo de vida y bienestar preventivo.', 'elenarostova', 'https://linkedin.com/in/elena-rostova'),
(2, 'Carlos Mendoza', 'carlos-mendoza', 'Analista de Macroeconomía y Negocios', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80', 'Economista y consultor de políticas públicas con publicaciones en diarios líderes de Latinoamérica.', 'carlosmendoza_eco', 'https://linkedin.com/in/carlos-mendoza-eco'),
(3, 'Sofía Valenzuela', 'sofia-valenzuela', 'Corresponsal de Tecnología & Futuro', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80', 'Especializada en inteligencia artificial, movilidad sustentable y ecosistemas de innovación tecnológica.', 'sofiavalenzuela_tech', 'https://linkedin.com/in/sofia-valenzuela-tech'),
(4, 'Mateo Benítez', 'mateo-benitez', 'Redactor Senior de Infraestructura', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80', 'Ingeniero civil y periodista enfocado en megaconstrucciones, puertos y energías renovables en la región.', 'mateo_infra', 'https://linkedin.com/in/mateo-benitez')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- Default Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `seo_title`, `meta_description`, `color`, `sort_order`, `status`) VALUES
(1, 'Actualidad', 'actualidad', 'Las noticias más relevantes y análisis de los acontecimientos que marcan la agenda global y regional.', 'Noticias de Actualidad | Análisis Editorial', 'Entérate de las últimas noticias de actualidad, reportajes en profundidad y hechos clave del día.', '#2563eb', 1, 'active'),
(2, 'Economía', 'economia', 'Tendencias de mercados, finanzas corporativas, inflación, comercio exterior e inversiones estratégicas.', 'Economía y Finanzas | Análisis del Mercado', 'Cobertura diaria de economía, mercados financieros, inversiones y políticas fiscales.', '#059669', 2, 'active'),
(3, 'Política', 'politica', 'Debates legislativos, decisiones de gobierno, gobernabilidad y cobertura institucional transparente.', 'Política y Gobernanza | Portal de Noticias', 'Análisis político riguroso, seguimiento a políticas públicas y debates electorales.', '#dc2626', 3, 'active'),
(4, 'Infraestructura', 'infraestructura', 'Proyectos viales, energía limpia, desarrollo urbano, logística portuaria y modernización territorial.', 'Infraestructura y Desarrollo | Obras y Logística', 'Descubre los grandes proyectos de infraestructura, inversión pública y desarrollo sostenible.', '#d97706', 4, 'active'),
(5, 'Tecnología', 'tecnologia', 'Transformación digital, inteligencia artificial, ciberseguridad y avances científicos de vanguardia.', 'Tecnología e Innovación | Futuro Digital', 'Información sobre avances en IA, tecnología corporativa y el impacto digital en la sociedad.', '#7c3aed', 5, 'active'),
(6, 'Opinión', 'opinion', 'Columnas de especialistas, análisis críticos y miradas expertas sobre el panorama contemporáneo.', 'Columnas de Opinión y Ensayos | Perspectivas', 'Ensayos y columnas de destacados analistas sobre los temas más trascendentales.', '#4b5563', 6, 'active')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- Default Site Settings
INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('site_name', 'PULSO EDITORIAL'),
('site_tagline', 'Periodismo riguroso, análisis profundo y visión de futuro'),
('site_description', 'Portal de noticias y revista digital con cobertura integral de actualidad, economía, tecnología, infraestructura y análisis editorial independiente.'),
('site_url', 'https://tudominio.com'),
('site_logo', ''),
('site_favicon', ''),
('posts_per_page', '9'),
('contact_email', 'contacto@tudominio.com'),
('twitter_handle', '@pulsoeditorial'),
('facebook_url', 'https://facebook.com/pulsoeditorial'),
('instagram_url', 'https://instagram.com/pulsoeditorial'),
('linkedin_url', 'https://linkedin.com/company/pulsoeditorial'),
('footer_about', 'PULSO EDITORIAL es un medio de comunicación independiente comprometido con la veracidad informativa, el análisis económico de calidad y la difusión del progreso tecnológico.'),
('google_analytics_id', ''),
('enable_rss', '1'),
('enable_sitemaps', '1')
ON DUPLICATE KEY UPDATE `setting_key`=`setting_key`;

-- Sample Articles
INSERT INTO `posts` (`id`, `title`, `slug`, `category_id`, `author_id`, `excerpt`, `content`, `image`, `image_alt`, `is_hero`, `is_featured`, `status`, `views`, `seo_title`, `meta_description`, `canonical_url`, `robots`, `published_at`) VALUES
(1, 'Transformación energética: La revolución silenciosa de las redes solares y el hidrógeno verde', 'transformacion-energetica-redes-solares-hidrogeno-verde', 4, 4, 'El despliegue masivo de granjas solares y plantas piloto de hidrógeno proyecta un cambio radical en la matriz eléctrica para la próxima década.', '<p>La transición hacia modelos energéticos sostenibles ha dejado de ser una promesa de futuro para convertirse en un motor primordial de la inversión pública y privada. Durante los últimos doce meses, la región ha experimentado una inyección de capital sin precedentes destinada a plantas de generación fotovoltaica y proyectos piloto de hidrógeno verde.</p><h2>El salto cuantitativo en generación fotovoltaica</h2><p>El abaratamiento de los componentes solares y la mejora en los sistemas de almacenamiento electroquímico con baterías de litio-ferrofosfato han permitido alcanzar un costo nivelado de energía (LCOE) altamente competitivo frente a los ciclos combinados tradicionales.</p><blockquote>"Estamos ante una ventana de oportunidad irrepetible donde la eficiencia tecnológica coincide plenamente con la rentabilidad financiera a largo plazo."</blockquote><p>Entre los principales hitos destacan:</p><ul><li><strong>Interconexión de alta tensión:</strong> Más de 1.200 kilómetros de nuevas líneas troncales para transportar energía limpia desde zonas desérticas hacia los grandes centros urbanos.</li><li><strong>Descentralización de la generación:</strong> Fomento masivo de sistemas solares sobre techos en naves industriales y complejos residenciales.</li><li><strong>Hubs de exportación:</strong> Adecuación de terminales marítimas para el transporte seguro de amoníaco verde hacia mercados europeos y asiáticos.</li></ul><h2>Desafíos regulatorios y estabilidad de red</h2><p>A pesar del optimismo, los especialistas advierten que la intermitencia inherente a las fuentes renovables no convencionales requiere una modernización urgente de los sistemas de despacho y algoritmos de control de frecuencia en tiempo real.</p><p>Las autoridades regulatorias ya debaten nuevas normativas de capacidad firme y servicios complementarios para garantizar que la transición energética mantenga la confiabilidad del suministro eléctrico en todo momento.</p>', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&auto=format&fit=crop&q=80', 'Parque de paneles solares durante el atardecer', 1, 1, 'published', 1420, 'Transformación Energética: Redes Solares y el Hidrógeno Verde', 'Análisis detallado sobre el auge de las energías renovables, redes solares e hidrógeno verde en el sector de infraestructura.', NULL, 'index, follow', '2026-08-16 10:00:00'),

(2, 'Inflación global y tasas de interés: Cómo se perfila el segundo semestre financiero', 'inflacion-global-tasas-de-interes-segundo-semestre', 2, 2, 'Los bancos centrales calibran el ritmo de recortes en los tipos de referencia mientras los mercados de materias primas muestran una volatilidad moderada.', '<p>Los principales comités de política monetaria enfrentan un delicado equilibrio entre controlar las presiones residuales en el sector servicios y evitar una contracción innecesaria del crédito productivo.</p><h2>La trayectoria de la tasa de referencia</h2><p>Tras varios trimestres de tipos restrictivos, la inflación subyacente ha convergido gradualmente hacia las metas oficiales. Sin embargo, la persistencia en los costos laborales y el encarecimiento de fletes marítimos obligan a mantener una postura de máxima cautela.</p><p>Los analistas proyectan un ciclo de flexibilización gradual con recortes estimados de 25 puntos básicos por trimestre hasta finales de 2027.</p>', 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1000&auto=format&fit=crop&q=80', 'Gráficos financieros y cotizaciones bursátiles', 0, 1, 'published', 980, 'Inflación y Tasas de Interés: Análisis del Segundo Semestre', 'Descubre las proyecciones económicas para el segundo semestre y las decisiones de los bancos centrales.', NULL, 'index, follow', '2026-08-15 14:30:00'),

(3, 'Inteligencia Artificial generativa en la medicina: Diagnósticos precoces y tratamientos personalizados', 'inteligencia-artificial-medicina-diagnosticos-precoces', 5, 3, 'Algoritmos multimodales analizan imágenes radiológicas y secuencias genómicas con una precisión superior al 95%, acelerando la detección oncológica.', '<p>La integración de modelos de aprendizaje profundo en la práctica clínica hospitalaria está transformando la medicina diagnóstica. Centros de referencia mundial ya utilizan sistemas capaces de correlacionar biomarcadores genéticos con tomografías de alta resolución en cuestión de segundos.</p><h2>Impacto en el cribado temprano</h2><p>El diagnóstico precoz de patologías complejas como el cáncer de páncreas y las cardiopatías congénitas ha registrado un incremento notable en su tasa de supervivencia gracias al reconocimiento temprano de anomalías microscópicas.</p>', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop&q=80', 'Médicos analizando datos en pantalla digital', 0, 1, 'published', 1150, 'IA en la Medicina: Diagnósticos Precoces y Tratamientos Personalizados', 'Cómo la inteligencia artificial está revolucionando los diagnósticos médicos y la salud de precisión.', NULL, 'index, follow', '2026-08-15 09:15:00'),

(4, 'Nutrición basada en evidencia: Los 5 pilares para optimizar tu metabolismo y energía diaria', 'nutricion-basada-en-evidencia-pilares-metabolismo', 1, 1, 'Más allá de las modas alimentarias, la literatura científica ratifica el impacto del balance proteico, la fibra fermentable y la hidratación celular.', '<p>En la era de la sobreinformación nutricional, volver a los fundamentos fisiológicos respaldados por metaanálisis es la estrategia más eficaz para sostener un rendimiento físico y cognitivo óptimo a lo largo del día.</p><h2>1. Suficiencia y distribución proteica</h2><p>Consumir entre 1.6 y 2.2 gramos de proteína por kilogramo de peso corporal favorece la síntesis de masa muscular magra y estabiliza la saciedad prolongada.</p><h2>2. Diversidad de fibra vegetal</h2><p>Una microbiota intestinal saludable se nutre de al menos 30 especies botánicas diferentes por semana, incluyendo legumbres, semillas y hortalizas de hojas oscuras.</p>', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1000&auto=format&fit=crop&q=80', 'Plato saludable con vegetales frescos y aguacate', 0, 1, 'published', 2340, 'Nutrición Basada en Evidencia: 5 Pilares del Metabolismo', 'Guía completa respaldada por ciencia para mejorar tu metabolismo y energía diaria con nutrición real.', NULL, 'index, follow', '2026-08-14 16:45:00'),

(5, 'Reforma electoral y gobernabilidad: El debate parlamentario sobre representación y transparencia', 'reforma-electoral-gobernabilidad-debate-parlamentario', 3, 2, 'El congreso inicia la discusión de un paquete de leyes orientado a fortalecer la fiscalización de partidos y el voto digital auditado.', '<p>El debate sobre la modernización de las instituciones democráticas ha entrado en una fase decisiva. La comisión de constitución presentó el dictamen que busca elevar los estándares de rendición de cuentas del financiamiento partidario.</p>', 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000&auto=format&fit=crop&q=80', 'Edificio del parlamento con cúpula clásica', 0, 0, 'published', 620, 'Reforma Electoral y Gobernabilidad | Análisis Político', 'El debate legislativo que busca mayor transparencia y modernización institucional.', NULL, 'index, follow', '2026-08-13 11:20:00'),

(6, 'Mega puertos inteligentes: La carrera por liderar el comercio marítimo interoceánico', 'mega-puertos-inteligentes-comercio-maritimo', 4, 4, 'Grúas pórtico automatizadas por 5G y sistemas OCR para contenedores reducen los tiempos de atraque y posicionan a los terminales como nodos clave.', '<p>La logística internacional vive una era de digitalización total. Los nuevos terminales multipropósito integran inteligencia artificial para la asignación óptima de bahías y grúas autónomas guiadas por satélite.</p>', 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1000&auto=format&fit=crop&q=80', 'Puerto marítimo de carga con contenedores y grúas', 0, 0, 'published', 890, 'Mega Puertos Inteligentes: El Futuro del Comercio Marítimo', 'Conoce cómo los puertos modernos incorporan automatización y 5G para acelerar la logística global.', NULL, 'index, follow', '2026-08-12 18:10:00'),

(7, 'Microchips de 2 nanómetros: La batalla geopolítica por la supremacía en semiconductores', 'microchips-2-nanometros-batalla-semiconductores', 5, 3, 'Las fundiciones de vanguardia preparan la producción comercial con arquitectura GAAFET, desafiando los límites de la física cuántica.', '<p>La litografía ultravioleta extrema (EUV) con alta apertura numérica representa el pináculo de la ingeniería humana contemporánea. Los nuevos transistores de nanocables prometen un 30% más de rendimiento con la mitad de consumo eléctrico.</p>', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80', 'Placa de circuito electrónico y microprocesador', 0, 0, 'published', 1380, 'Microchips de 2nm: La Nueva Era de los Semiconductores', 'Análisis sobre la producción de chips de 2 nanómetros y la competencia tecnológica internacional.', NULL, 'index, follow', '2026-08-11 08:30:00'),

(8, 'El valor del pensamiento crítico en la era de la inmediatez informativa', 'pensamiento-critico-era-inmediatez-informativa', 6, 1, 'Columna: Frente al bombardeo incesante de titulares de impacto, la pausa reflexiva y la verificación rigurosa son el antídoto contra la desinformación.', '<p>Vivimos inmersos en una vorágine de estímulos digitales donde la rapidez suele premiarse por encima de la veracidad. Ejercitar la duda metódica y contrastar fuentes primarias no es un lujo intelectual, sino una necesidad cívica indispensable.</p>', 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000&auto=format&fit=crop&q=80', 'Persona escribiendo reflexivamente en libreta', 0, 0, 'published', 1540, 'Pensamiento Crítico e Inmediatez Informativa | Columna', 'Reflexión editorial sobre el desafío de contrastar fuentes y mantener el rigor en la era de los algoritmos.', NULL, 'index, follow', '2026-08-10 12:00:00')
ON DUPLICATE KEY UPDATE `id`=`id`;

COMMIT;
