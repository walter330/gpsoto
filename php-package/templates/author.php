<?php
/**
 * Author Profile and Articles Template
 */

declare(strict_types=1);

$siteUrl = rtrim(SITE_URL, '/');
$pdo = DB::getConnection();

if (empty($author)) {
    header("HTTP/1.0 404 Not Found");
    require_once __DIR__ . '/404.php';
    exit;
}

$stmt = $pdo->prepare("
    SELECT p.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color
    FROM posts p
    JOIN categories c ON p.category_id = c.id
    WHERE p.author_id = :author_id AND p.status = 'published'
    ORDER BY p.published_at DESC
");
$stmt->execute(['author_id' => $author['id']]);
$authorPosts = $stmt->fetchAll();
$totalPosts = count($authorPosts);
?>

<div class="author-page-wrapper">
    <section class="author-header-section">
        <div class="container">
            <nav class="editorial-breadcrumbs" aria-label="Migas de pan">
                <ol>
                    <li><a href="<?= e($siteUrl) ?>/">Inicio</a></li>
                    <li><span class="breadcrumb-separator">/</span></li>
                    <li>Autores</li>
                    <li><span class="breadcrumb-separator">/</span></li>
                    <li aria-current="page"><?= e($author['name']) ?></li>
                </ol>
            </nav>

            <div class="author-profile-box">
                <div class="author-profile-avatar">
                    <img src="<?= e($author['avatar']) ?>" alt="<?= e($author['name']) ?>" width="120" height="120">
                </div>
                <div class="author-profile-info">
                    <span class="author-profile-badge">Perfil de Redacción</span>
                    <h1 class="author-profile-name"><?= e($author['name']) ?></h1>
                    <p class="author-profile-role"><?= e($author['role_title'] ?? 'Periodista Editorial') ?></p>
                    <p class="author-profile-bio"><?= e($author['bio'] ?? 'Autor en Pulso Editorial.') ?></p>
                    <div class="author-profile-links">
                        <?php if (!empty($author['twitter'])): ?>
                            <a href="https://twitter.com/<?= e(ltrim($author['twitter'], '@')) ?>" target="_blank" rel="noopener">Twitter / X</a>
                        <?php endif; ?>
                        <?php if (!empty($author['linkedin'])): ?>
                            <a href="<?= e($author['linkedin']) ?>" target="_blank" rel="noopener">LinkedIn</a>
                        <?php endif; ?>
                        <span class="author-article-count"><?= $totalPosts ?> artículos publicados</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="author-articles-section">
        <div class="container">
            <div class="section-heading-row">
                <h2 class="section-title">Artículos de <?= e($author['name']) ?></h2>
            </div>
            <?php if (empty($authorPosts)): ?>
                <p>Este autor no tiene publicaciones disponibles.</p>
            <?php else: ?>
                <div class="articles-grid-3col">
                    <?php foreach ($authorPosts as $post): ?>
                        <article class="standard-article-card">
                            <a href="<?= e($siteUrl) ?>/<?= e($post['category_slug']) ?>/<?= e($post['slug']) ?>/" class="article-card-inner">
                                <div class="article-card-media">
                                    <img src="<?= e($post['image']) ?>" alt="<?= e($post['title']) ?>" loading="lazy" width="400" height="240">
                                    <span class="category-badge small" style="background-color: <?= e($post['category_color'] ?: '#2563eb') ?>">
                                        <?= e($post['category_name']) ?>
                                    </span>
                                </div>
                                <div class="article-card-content">
                                    <h3 class="article-card-title"><?= e($post['title']) ?></h3>
                                    <p class="article-card-excerpt"><?= e($post['excerpt']) ?></p>
                                    <div class="article-card-footer">
                                        <time class="post-date" datetime="<?= e($post['published_at']) ?>"><?= format_date($post['published_at']) ?></time>
                                    </div>
                                </div>
                            </a>
                        </article>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </section>
</div>
