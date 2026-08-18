<?php
/**
 * Public Header Template
 * SEO Meta, Open Graph, Twitter Cards, Schema.org JSON-LD & Dynamic Navigation
 */

declare(strict_types=1);

require_once __DIR__ . '/functions.php';

$siteName = get_setting('site_name', 'PULSO EDITORIAL');
$siteTagline = get_setting('site_tagline', 'Periodismo riguroso y análisis editorial');
$siteDesc = get_setting('site_description', 'Portal de noticias y actualidad.');
$siteUrl = rtrim(SITE_URL, '/');

// Defaults for page-specific SEO variables
$pageTitle = $pageTitle ?? ($siteName . ' | ' . $siteTagline);
$pageDesc = $pageDesc ?? $siteDesc;
$canonicalUrl = $canonicalUrl ?? $siteUrl . ($_SERVER['REQUEST_URI'] ?? '');
$ogImage = $ogImage ?? ($siteUrl . '/assets/img/og-default.jpg');
$ogType = $ogType ?? 'website';
$robots = $robots ?? 'index, follow';
$categories = get_categories();
?>
<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($pageTitle) ?></title>
    <meta name="description" content="<?= e($pageDesc) ?>">
    <meta name="robots" content="<?= e($robots) ?>">
    <link rel="canonical" href="<?= e($canonicalUrl) ?>">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:locale" content="es_ES">
    <meta property="og:type" content="<?= e($ogType) ?>">
    <meta property="og:title" content="<?= e($pageTitle) ?>">
    <meta property="og:description" content="<?= e($pageDesc) ?>">
    <meta property="og:url" content="<?= e($canonicalUrl) ?>">
    <meta property="og:site_name" content="<?= e($siteName) ?>">
    <meta property="og:image" content="<?= e($ogImage) ?>">
    <meta property="og:image:alt" content="<?= e($pageTitle) ?>">

    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= e($pageTitle) ?>">
    <meta name="twitter:description" content="<?= e($pageDesc) ?>">
    <meta name="twitter:image" content="<?= e($ogImage) ?>">
    <?php if ($twitter = get_setting('twitter_handle')): ?>
        <meta name="twitter:site" content="<?= e($twitter) ?>">
    <?php endif; ?>

    <!-- Feeds & Sitemaps -->
    <link rel="alternate" type="application/rss+xml" title="<?= e($siteName) ?> » Feed" href="<?= e($siteUrl) ?>/feed/">
    
    <!-- Favicon & Styles -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= e($siteUrl) ?>/assets/css/style.css">

    <!-- Schema.org JSON-LD -->
    <?php if (isset($schemaJsonLd)): ?>
        <script type="application/ld+json">
        <?= json_encode($schemaJsonLd, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) ?>
        </script>
    <?php else: ?>
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "<?= e($siteName) ?>",
            "url": "<?= e($siteUrl) ?>",
            "description": "<?= e($siteDesc) ?>",
            "potentialAction": {
                "@type": "SearchAction",
                "target": "<?= e($siteUrl) ?>/buscar/?q={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        }
        </script>
    <?php endif; ?>
</head>
<body>

    <!-- Reading Progress Bar (Single Article View) -->
    <div id="readingProgressBar" class="reading-progress-bar"></div>

    <!-- Top Bar / Breaking Banner -->
    <div class="top-announcement-bar">
        <div class="container top-bar-content">
            <span class="pulse-indicator"></span>
            <span class="top-bar-label">EN VIVO</span>
            <p class="top-bar-text">Cobertura especial y análisis de profundidad del panorama actual.</p>
            <a href="<?= e($siteUrl) ?>/actualidad/" class="top-bar-link">Ver última hora &rarr;</a>
        </div>
    </div>

    <!-- Main Navigation Header -->
    <header class="site-header" id="siteHeader">
        <div class="container header-container">
            <!-- Mobile Menu Toggle Button -->
            <button class="mobile-toggle" id="mobileMenuBtn" aria-label="Abrir menú" aria-expanded="false">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>

            <!-- Brand Logo -->
            <a href="<?= e($siteUrl) ?>/" class="site-brand">
                <span class="brand-name"><?= e($siteName) ?></span>
                <span class="brand-tagline">DIGITAL</span>
            </a>

            <!-- Desktop Category Navigation -->
            <nav class="desktop-nav" aria-label="Navegación Principal">
                <ul class="nav-list">
                    <li><a href="<?= e($siteUrl) ?>/" class="nav-link <?= empty($currentCategorySlug) && empty($isSingle) && empty($isAuthor) ? 'active' : '' ?>">Inicio</a></li>
                    <?php foreach ($categories as $cat): ?>
                        <li>
                            <a href="<?= e($siteUrl) ?>/<?= e($cat['slug']) ?>/" class="nav-link <?= (isset($currentCategorySlug) && $currentCategorySlug === $cat['slug']) ? 'active' : '' ?>">
                                <?= e($cat['name']) ?>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </nav>

            <!-- Header Actions (Search & Admin Access) -->
            <div class="header-actions">
                <button class="search-trigger-btn" id="searchTriggerBtn" aria-label="Buscar noticias">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <span class="search-btn-text">Buscar</span>
                </button>
                <a href="<?= e($siteUrl) ?>/admin/" class="admin-access-badge" title="Acceso al CMS Administrador">
                    CMS
                </a>
            </div>
        </div>
    </header>

    <!-- Mobile Drawer Navigation -->
    <div class="mobile-drawer-overlay" id="mobileOverlay"></div>
    <aside class="mobile-drawer" id="mobileDrawer" aria-label="Menú Móvil">
        <div class="drawer-header">
            <span class="brand-name"><?= e($siteName) ?></span>
            <button class="drawer-close-btn" id="drawerCloseBtn" aria-label="Cerrar menú">&times;</button>
        </div>
        <div class="drawer-search">
            <form action="<?= e($siteUrl) ?>/buscar/" method="GET">
                <input type="text" name="q" placeholder="Buscar temas, noticias..." required>
                <button type="submit" aria-label="Buscar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
            </form>
        </div>
        <nav class="drawer-nav">
            <ul>
                <li><a href="<?= e($siteUrl) ?>/" class="drawer-link">Inicio</a></li>
                <?php foreach ($categories as $cat): ?>
                    <li>
                        <a href="<?= e($siteUrl) ?>/<?= e($cat['slug']) ?>/" class="drawer-link">
                            <?= e($cat['name']) ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </nav>
        <div class="drawer-footer">
            <a href="<?= e($siteUrl) ?>/admin/" class="drawer-cms-btn">Panel de Control CMS</a>
        </div>
    </aside>

    <!-- Search Modal Overlay -->
    <div class="search-modal-backdrop" id="searchModal">
        <div class="search-modal-box">
            <div class="search-modal-header">
                <h3>Buscar en <?= e($siteName) ?></h3>
                <button class="search-modal-close" id="searchModalClose">&times;</button>
            </div>
            <form action="<?= e($siteUrl) ?>/buscar/" method="GET" class="search-modal-form">
                <div class="search-input-wrapper">
                    <input type="text" name="q" id="searchModalInput" placeholder="Escribe palabras clave (ej: economía, energía, IA)..." autocomplete="off" required>
                    <button type="submit" class="btn-primary">Buscar</button>
                </div>
            </form>
            <div class="search-modal-suggestions">
                <span>Temas populares:</span>
                <a href="<?= e($siteUrl) ?>/infraestructura/">Infraestructura</a>
                <a href="<?= e($siteUrl) ?>/tecnologia/">Inteligencia Artificial</a>
                <a href="<?= e($siteUrl) ?>/economia/">Mercados</a>
                <a href="<?= e($siteUrl) ?>/actualidad/">Salud</a>
            </div>
        </div>
    </div>
    
    <main id="mainContent">
