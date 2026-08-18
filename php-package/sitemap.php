<?php
/**
 * Dynamic XML Sitemap Generator
 * Supports sitemap-index, noticias-sitemap, categorias-sitemap, autores-sitemap
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/functions.php';

header('Content-Type: application/xml; charset=utf-8');

$pdo = DB::getConnection();
$siteUrl = rtrim(SITE_URL, '/');
$type = $_GET['type'] ?? 'all';

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";

// Sitemap Index format
if ($type === 'index') {
    ?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
            <loc><?= e($siteUrl) ?>/noticias-sitemap.xml</loc>
            <lastmod><?= date('Y-m-d') ?></lastmod>
        </sitemap>
        <sitemap>
            <loc><?= e($siteUrl) ?>/categorias-sitemap.xml</loc>
            <lastmod><?= date('Y-m-d') ?></lastmod>
        </sitemap>
        <sitemap>
            <loc><?= e($siteUrl) ?>/autores-sitemap.xml</loc>
            <lastmod><?= date('Y-m-d') ?></lastmod>
        </sitemap>
        <sitemap>
            <loc><?= e($siteUrl) ?>/news-sitemap.xml</loc>
            <lastmod><?= date('Y-m-d') ?></lastmod>
        </sitemap>
    </sitemapindex>
    <?php
    exit;
}

// Single / Full URL Set format
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    
    <!-- Home Page -->
    <?php if ($type === 'all' || $type === 'main'): ?>
    <url>
        <loc><?= e($siteUrl) ?>/</loc>
        <lastmod><?= date('Y-m-d') ?></lastmod>
        <changefreq>hourly</changefreq>
        <priority>1.0</priority>
    </url>
    <?php endif; ?>

    <!-- Categories -->
    <?php if ($type === 'all' || $type === 'categorias'): 
        $cats = get_categories();
        foreach ($cats as $cat): ?>
        <url>
            <loc><?= e($siteUrl) ?>/<?= e($cat['slug']) ?>/</loc>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
        </url>
    <?php endforeach; endif; ?>

    <!-- Articles / News -->
    <?php if ($type === 'all' || $type === 'noticias'):
        $stmt = $pdo->prepare("
            SELECT p.title, p.slug, p.image, p.published_at, p.updated_at, c.slug AS category_slug
            FROM posts p
            JOIN categories c ON p.category_id = c.id
            WHERE p.status = 'published' AND (p.robots NOT LIKE '%noindex%')
            ORDER BY p.published_at DESC
            LIMIT 500
        ");
        $stmt->execute();
        $posts = $stmt->fetchAll();
        foreach ($posts as $p):
            $postDate = !empty($p['updated_at']) ? $p['updated_at'] : $p['published_at'];
        ?>
        <url>
            <loc><?= e($siteUrl) ?>/<?= e($p['category_slug']) ?>/<?= e($p['slug']) ?>/</loc>
            <lastmod><?= date('Y-m-d\TH:i:sP', strtotime($postDate)) ?></lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.9</priority>
            <?php if (!empty($p['image'])): ?>
                <image:image>
                    <image:loc><?= e($p['image']) ?></image:loc>
                    <image:title><?= e($p['title']) ?></image:title>
                </image:image>
            <?php endif; ?>
        </url>
    <?php endforeach; endif; ?>

    <!-- Authors -->
    <?php if ($type === 'all' || $type === 'autores'):
        $authStmt = $pdo->query("SELECT slug FROM authors ORDER BY name ASC");
        $authors = $authStmt->fetchAll();
        foreach ($authors as $a): ?>
        <url>
            <loc><?= e($siteUrl) ?>/autor/<?= e($a['slug']) ?>/</loc>
            <changefreq>weekly</changefreq>
            <priority>0.6</priority>
        </url>
    <?php endforeach; endif; ?>

</urlset>
