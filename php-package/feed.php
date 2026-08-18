<?php
/**
 * RSS 2.0 Feed Generator
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/functions.php';

header('Content-Type: application/rss+xml; charset=utf-8');

$pdo = DB::getConnection();
$siteUrl = rtrim(SITE_URL, '/');
$siteName = get_setting('site_name', 'PULSO EDITORIAL');
$siteDesc = get_setting('site_description', 'Portal de noticias y actualidad.');

$stmt = $pdo->prepare("
    SELECT p.*, c.name AS category_name, c.slug AS category_slug,
           a.name AS author_name, a.email AS author_email
    FROM posts p
    JOIN categories c ON p.category_id = c.id
    JOIN authors a ON p.author_id = a.id
    WHERE p.status = 'published'
    ORDER BY p.published_at DESC
    LIMIT 25
");
$stmt->execute();
$posts = $stmt->fetchAll();

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title><?= e($siteName) ?></title>
    <link><?= e($siteUrl) ?>/</link>
    <description><?= e($siteDesc) ?></description>
    <language>es-ES</language>
    <lastBuildDate><?= date(DATE_RSS) ?></lastBuildDate>
    <atom:link href="<?= e($siteUrl) ?>/feed/" rel="self" type="application/rss+xml" />
    <generator>PulsoEditorial-PHP-CMS</generator>

    <?php foreach ($posts as $post): 
        $itemUrl = $siteUrl . '/' . $post['category_slug'] . '/' . $post['slug'] . '/';
    ?>
    <item>
      <title><![CDATA[<?= $post['title'] ?>]]></title>
      <link><?= e($itemUrl) ?></link>
      <guid isPermaLink="true"><?= e($itemUrl) ?></guid>
      <dc:creator><![CDATA[<?= $post['author_name'] ?>]]></dc:creator>
      <pubDate><?= date(DATE_RSS, strtotime($post['published_at'])) ?></pubDate>
      <category><![CDATA[<?= $post['category_name'] ?>]]></category>
      <description><![CDATA[<?= $post['excerpt'] ?>]]></description>
      <?php if (!empty($post['image'])): ?>
      <enclosure url="<?= e($post['image']) ?>" type="image/jpeg" length="0" />
      <?php endif; ?>
      <content:encoded><![CDATA[<?= $post['content'] ?>]]></content:encoded>
    </item>
    <?php endforeach; ?>
  </channel>
</rss>
