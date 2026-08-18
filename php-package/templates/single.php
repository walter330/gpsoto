<?php
/**
 * Single Article / Post Detail Template
 * Rich Typography, Author Block, Social Share, Related Posts, Schema.org JSON-LD
 */

declare(strict_types=1);

$siteUrl = rtrim(SITE_URL, '/');
$pdo = DB::getConnection();

// $post is supplied by router
if (empty($post)) {
    header("HTTP/1.0 404 Not Found");
    require_once __DIR__ . '/404.php';
    exit;
}

// Increment View Counter atomically
try {
    $viewStmt = $pdo->prepare("UPDATE posts SET views = views + 1 WHERE id = :id");
    $viewStmt->execute(['id' => $post['id']]);
} catch (Exception $e) {
    // Silent catch
}

$readTime = estimate_reading_time($post['content']);
$shareUrl = urlencode($siteUrl . '/' . $post['category_slug'] . '/' . $post['slug'] . '/');
$shareTitle = urlencode($post['title']);

// Fetch 3 Related Articles in same category
$relStmt = $pdo->prepare("
    SELECT p.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
           a.name AS author_name, a.slug AS author_slug
    FROM posts p
    JOIN categories c ON p.category_id = c.id
    JOIN authors a ON p.author_id = a.id
    WHERE p.category_id = :cat_id AND p.id != :post_id AND p.status = 'published'
    ORDER BY p.published_at DESC
    LIMIT 3
");
$relStmt->execute([
    'cat_id'  => $post['category_id'],
    'post_id' => $post['id']
]);
$relatedPosts = $relStmt->fetchAll();

// Fetch 4 Latest News for the Sidebar
$sideStmt = $pdo->prepare("
    SELECT p.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color
    FROM posts p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id != :post_id AND p.status = 'published'
    ORDER BY p.published_at DESC
    LIMIT 4
");
$sideStmt->execute(['post_id' => $post['id']]);
$sidebarLatest = $sideStmt->fetchAll();
?>

<article class="single-article-wrapper">
    <div class="container article-layout-container">
        
        <!-- Main Article Column -->
        <div class="article-main-column">
            
            <!-- Breadcrumbs -->
            <nav class="editorial-breadcrumbs" aria-label="Migas de pan">
                <ol>
                    <li><a href="<?= e($siteUrl) ?>/">Inicio</a></li>
                    <li><span class="breadcrumb-separator">/</span></li>
                    <li><a href="<?= e($siteUrl) ?>/<?= e($post['category_slug']) ?>/"><?= e($post['category_name']) ?></a></li>
                    <li><span class="breadcrumb-separator">/</span></li>
                    <li aria-current="page" class="breadcrumb-current"><?= e(mb_strimwidth($post['title'], 0, 45, '...')) ?></li>
                </ol>
            </nav>

            <!-- Article Header -->
            <header class="single-article-header">
                <a href="<?= e($siteUrl) ?>/<?= e($post['category_slug']) ?>/" class="category-badge-link" style="background-color: <?= e($post['category_color'] ?: '#2563eb') ?>">
                    <?= e($post['category_name']) ?>
                </a>
                
                <h1 class="single-article-title"><?= e($post['title']) ?></h1>

                <?php if (!empty($post['excerpt'])): ?>
                    <p class="single-article-bajada"><?= e($post['excerpt']) ?></p>
                <?php endif; ?>

                <div class="article-meta-row">
                    <div class="meta-author-box">
                        <?php if (!empty($post['author_avatar'])): ?>
                            <img src="<?= e($post['author_avatar']) ?>" alt="<?= e($post['author_name']) ?>" class="author-avatar-img" width="48" height="48">
                        <?php endif; ?>
                        <div class="author-details">
                            <a href="<?= e($siteUrl) ?>/autor/<?= e($post['author_slug']) ?>/" class="author-link-name"><?= e($post['author_name']) ?></a>
                            <span class="author-role-sub"><?= e($post['author_role'] ?? 'Redacción') ?></span>
                        </div>
                    </div>

                    <div class="meta-date-box">
                        <div class="date-line">
                            <span class="date-label">Publicado:</span>
                            <time datetime="<?= e($post['published_at']) ?>"><?= format_date($post['published_at']) ?></time>
                        </div>
                        <?php if (!empty($post['updated_at']) && strtotime($post['updated_at']) > strtotime($post['published_at']) + 3600): ?>
                            <div class="date-line updated">
                                <span class="date-label">Actualizado:</span>
                                <time datetime="<?= e($post['updated_at']) ?>"><?= format_date($post['updated_at']) ?></time>
                            </div>
                        <?php endif; ?>
                        <div class="reading-time-pill">
                            <span><?= $readTime ?> min de lectura</span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Social Share Bar (Top) -->
            <div class="social-share-bar">
                <span class="share-label">Compartir artículo:</span>
                <div class="share-buttons-group">
                    <a href="https://api.whatsapp.com/send?text=<?= $shareTitle ?>%20<?= $shareUrl ?>" target="_blank" rel="noopener" class="share-btn whatsapp" title="Compartir en WhatsApp">
                        WhatsApp
                    </a>
                    <a href="https://twitter.com/intent/tweet?text=<?= $shareTitle ?>&url=<?= $shareUrl ?>" target="_blank" rel="noopener" class="share-btn twitter" title="Compartir en X / Twitter">
                        X / Twitter
                    </a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=<?= $shareUrl ?>" target="_blank" rel="noopener" class="share-btn facebook" title="Compartir en Facebook">
                        Facebook
                    </a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=<?= $shareUrl ?>" target="_blank" rel="noopener" class="share-btn linkedin" title="Compartir en LinkedIn">
                        LinkedIn
                    </a>
                    <button class="share-btn copy-btn" id="copyArticleLinkBtn" data-url="<?= e($siteUrl . '/' . $post['category_slug'] . '/' . $post['slug'] . '/') ?>">
                        Copiar Enlace
                    </button>
                </div>
            </div>

            <!-- Featured Hero Image (NO lazy loading for LCP speed optimization) -->
            <div class="single-featured-media">
                <img src="<?= e($post['image']) ?>" alt="<?= e($post['image_alt'] ?: $post['title']) ?>" class="single-main-img" width="1000" height="580" fetchpriority="high">
                <?php if (!empty($post['image_alt'])): ?>
                    <figcaption class="image-caption"><?= e($post['image_alt']) ?></figcaption>
                <?php endif; ?>
            </div>

            <!-- Article Body Content -->
            <div class="article-content-body typography-prose">
                <?= $post['content'] ?>
            </div>

            <!-- Author Biography Card -->
            <div class="author-biography-card">
                <div class="author-bio-avatar-wrap">
                    <img src="<?= e($post['author_avatar']) ?>" alt="<?= e($post['author_name']) ?>" class="bio-avatar" width="80" height="80" loading="lazy">
                </div>
                <div class="author-bio-content">
                    <span class="bio-label">Sobre el autor</span>
                    <h3 class="bio-name">
                        <a href="<?= e($siteUrl) ?>/autor/<?= e($post['author_slug']) ?>/"><?= e($post['author_name']) ?></a>
                    </h3>
                    <p class="bio-role"><?= e($post['author_role'] ?? 'Especialista Editorial') ?></p>
                    <p class="bio-text"><?= e($post['author_bio'] ?? 'Periodista y redactor en Pulso Editorial.') ?></p>
                    <div class="bio-social-links">
                        <?php if (!empty($post['author_twitter'])): ?>
                            <a href="https://twitter.com/<?= e(ltrim($post['author_twitter'], '@')) ?>" target="_blank" rel="noopener">@<?= e(ltrim($post['author_twitter'], '@')) ?></a>
                        <?php endif; ?>
                        <?php if (!empty($post['author_linkedin'])): ?>
                            <a href="<?= e($post['author_linkedin']) ?>" target="_blank" rel="noopener">LinkedIn</a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Related Articles Grid -->
            <?php if (!empty($relatedPosts)): ?>
            <section class="related-articles-section">
                <div class="section-heading-row">
                    <div class="heading-title-group">
                        <span class="section-tag">Recomendados</span>
                        <h3 class="section-title">Artículos Relacionados</h3>
                    </div>
                </div>
                <div class="articles-grid-3col related-grid">
                    <?php foreach ($relatedPosts as $rel): ?>
                        <article class="standard-article-card">
                            <a href="<?= e($siteUrl) ?>/<?= e($rel['category_slug']) ?>/<?= e($rel['slug']) ?>/" class="article-card-inner">
                                <div class="article-card-media">
                                    <img src="<?= e($rel['image']) ?>" alt="<?= e($rel['title']) ?>" loading="lazy" width="350" height="200">
                                    <span class="category-badge small" style="background-color: <?= e($rel['category_color'] ?: '#2563eb') ?>">
                                        <?= e($rel['category_name']) ?>
                                    </span>
                                </div>
                                <div class="article-card-content">
                                    <h4 class="article-card-title"><?= e($rel['title']) ?></h4>
                                    <time class="post-date" datetime="<?= e($rel['published_at']) ?>"><?= format_date($rel['published_at']) ?></time>
                                </div>
                            </a>
                        </article>
                    <?php endforeach; ?>
                </div>
            </section>
            <?php endif; ?>

        </div>

        <!-- Sidebar Column -->
        <aside class="article-sidebar-column">
            
            <!-- Trending / Latest News Widget -->
            <div class="sidebar-widget">
                <h4 class="widget-title">Últimas Noticias</h4>
                <div class="sidebar-posts-list">
                    <?php foreach ($sidebarLatest as $idx => $side): ?>
                        <article class="sidebar-post-item">
                            <span class="sidebar-rank-number">0<?= $idx + 1 ?></span>
                            <div class="sidebar-post-body">
                                <span class="sidebar-cat-tag" style="color: <?= e($side['category_color'] ?: '#2563eb') ?>"><?= e($side['category_name']) ?></span>
                                <h5 class="sidebar-post-title">
                                    <a href="<?= e($siteUrl) ?>/<?= e($side['category_slug']) ?>/<?= e($side['slug']) ?>/">
                                        <?= e($side['title']) ?>
                                    </a>
                                </h5>
                                <time class="sidebar-post-date" datetime="<?= e($side['published_at']) ?>"><?= format_date($side['published_at']) ?></time>
                            </div>
                        </article>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Category Links Widget -->
            <div class="sidebar-widget">
                <h4 class="widget-title">Explorar Secciones</h4>
                <ul class="sidebar-categories-list">
                    <?php foreach (get_categories() as $catItem): ?>
                        <li>
                            <a href="<?= e($siteUrl) ?>/<?= e($catItem['slug']) ?>/">
                                <span><?= e($catItem['name']) ?></span>
                                <span class="cat-arrow">&rarr;</span>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>

            <!-- Sticky Newsletter Widget -->
            <div class="sidebar-widget newsletter-widget">
                <h4 class="widget-title">Boletín Exclusivo</h4>
                <p class="widget-desc">Recibe análisis periodísticos rigurosos cada semana.</p>
                <form class="sidebar-newsletter-form" onsubmit="event.preventDefault(); alert('Suscripción completada.');">
                    <input type="email" placeholder="Tu correo electrónico..." required>
                    <button type="submit" class="btn-primary w-full">Suscribirme</button>
                </form>
            </div>

        </aside>

    </div>
</article>
