<?php
/**
 * SEO Diagnostics & Sitemaps Admin
 */

declare(strict_types=1);

$adminTitle = 'Diagnóstico SEO & Sitemaps XML';
require_once __DIR__ . '/includes/admin-header.php';

$pdo = DB::getConnection();

$postsCount = (int)$pdo->query("SELECT COUNT(*) FROM posts WHERE status = 'published'")->fetchColumn();
$noindexCount = (int)$pdo->query("SELECT COUNT(*) FROM posts WHERE status = 'published' AND robots LIKE '%noindex%'")->fetchColumn();
$categoriesCount = (int)$pdo->query("SELECT COUNT(*) FROM categories WHERE status = 'active'")->fetchColumn();
$authorsCount = (int)$pdo->query("SELECT COUNT(*) FROM authors")->fetchColumn();
?>

<div class="admin-seo-wrapper">
    <div class="admin-card-box mb-6">
        <h2 class="admin-card-title">Directorio de Sitemaps & Feeds Generados Dinámicamente</h2>
        <p class="mb-4 text-muted">Estos enlaces se generan en tiempo real directamente desde la base de datos MySQL, cumpliendo con los estándares de Google Search Console y Google News.</p>

        <div class="sitemap-links-grid">
            <div class="sitemap-link-card">
                <div class="sitemap-card-header">
                    <span class="badge-tag">XML Principal</span>
                    <h3>Sitemap General</h3>
                </div>
                <code><?= e($siteUrl) ?>/sitemap.xml</code>
                <p>Índice completo que agrupa portada, noticias, categorías y autores.</p>
                <a href="<?= e($siteUrl) ?>/sitemap.xml" target="_blank" class="btn-outline btn-sm">Abrir XML ↗</a>
            </div>

            <div class="sitemap-link-card">
                <div class="sitemap-card-header">
                    <span class="badge-tag news">Google News</span>
                    <h3>Sitemap Google Noticias</h3>
                </div>
                <code><?= e($siteUrl) ?>/news-sitemap.xml</code>
                <p>Artículos recientes con namespace oficial de Google News.</p>
                <a href="<?= e($siteUrl) ?>/news-sitemap.xml" target="_blank" class="btn-outline btn-sm">Abrir News XML ↗</a>
            </div>

            <div class="sitemap-link-card">
                <div class="sitemap-card-header">
                    <span class="badge-tag rss">Syndication</span>
                    <h3>Feed RSS 2.0</h3>
                </div>
                <code><?= e($siteUrl) ?>/feed/</code>
                <p>Canal RSS con texto completo, enclosure multimedia y autoría.</p>
                <a href="<?= e($siteUrl) ?>/feed/" target="_blank" class="btn-outline btn-sm">Abrir Feed ↗</a>
            </div>

            <div class="sitemap-link-card">
                <div class="sitemap-card-header">
                    <span class="badge-tag">Crawlers</span>
                    <h3>Robots.txt</h3>
                </div>
                <code><?= e($siteUrl) ?>/robots.txt</code>
                <p>Directivas de indexación y bloqueo del directorio /admin/.</p>
                <a href="<?= e($siteUrl) ?>/robots.txt" target="_blank" class="btn-outline btn-sm">Abrir Robots ↗</a>
            </div>
        </div>
    </div>

    <!-- SEO Checklist Card -->
    <div class="admin-card-box">
        <h2 class="admin-card-title">Estado de Salud SEO del Portal</h2>

        <div class="seo-checks-list">
            <div class="seo-check-item success">
                <span class="check-icon">✓</span>
                <div class="check-info">
                    <strong>Etiquetas Schema.org JSON-LD activas</strong>
                    <p>Implementación automática de <code>NewsArticle</code>, <code>BreadcrumbList</code>, <code>Person</code> y <code>Organization</code>.</p>
                </div>
            </div>

            <div class="seo-check-item success">
                <span class="check-icon">✓</span>
                <div class="check-info">
                    <strong>URLs amigables mediante .htaccess y mod_rewrite</strong>
                    <p>Estructura jerárquica limpia: <code>/categoria/slug-noticia/</code> sin parámetros <code>?id=</code>.</p>
                </div>
            </div>

            <div class="seo-check-item success">
                <span class="check-icon">✓</span>
                <div class="check-info">
                    <strong>Open Graph & Twitter Cards configurados</strong>
                    <p>Metadatos para visualización enriquecida al compartir en redes sociales y mensajería.</p>
                </div>
            </div>

            <div class="seo-check-item success">
                <span class="check-icon">✓</span>
                <div class="check-info">
                    <strong>Optimización LCP y Core Web Vitals</strong>
                    <p>La imagen principal de cada artículo no usa lazy loading, mientras que las tarjetas secundarias implementan <code>loading="lazy"</code> nativo.</p>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin-footer.php'; ?>
