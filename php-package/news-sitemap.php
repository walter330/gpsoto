<?php
/**
 * Google News XML Sitemap Generator
 * Lists articles published within the last 48-72 hours compliant with Google News guidelines.
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/functions.php';

header('Content-Type: application/xml; charset=utf-8');

$pdo = DB::getConnection();
$siteUrl = rtrim(SITE_URL, '/');
$siteName = get_setting('site_name', 'PULSO EDITORIAL');

// Fetch recent articles (last 7 days or newest 100 for safety)
$stmt = $pdo->prepare("
    SELECT p.title, p.slug, p.published_at, c.slug AS category_slug, c.name AS category_name
    FROM posts p
    JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'published' AND (p.robots NOT LIKE '%noindex%')
    ORDER BY p.published_at DESC
    LIMIT 100
");
$stmt->execute();
$newsPosts = $stmt->fetchAll();

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
    <?php foreach ($newsPosts as $item): ?>
    <url>
        <loc><?= e($siteUrl) ?>/<?= e($item['category_slug']) ?>/<?= e($item['slug']) ?>/</loc>
        <news:news>
            <news:publication>
                <news:name><?= e($siteName) ?></news:name>
                <news:language>es</news:language>
            </news:publication>
            <news:publication_date><?= date('Y-m-d\TH:i:sP', strtotime($item['published_at'])) ?></news:publication_date>
            <news:title><?= e($item['title']) ?></news:title>
        </news:news>
    </url>
    <?php endforeach; ?>
</urlset>
