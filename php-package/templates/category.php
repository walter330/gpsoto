<?php
/**
 * Category Page Template with SEO-friendly Pagination (/categoria/page/2/)
 */

declare(strict_types=1);

$siteUrl = rtrim(SITE_URL, '/');
$pdo = DB::getConnection();

// $category is passed from router
if (empty($category)) {
    header("HTTP/1.0 404 Not Found");
    require_once __DIR__ . '/404.php';
    exit;
}

$page = (int)($currentPageNumber ?? 1);
if ($page < 1) $page = 1;
$perPage = (int)get_setting('posts_per_page', '9');
$offset = ($page - 1) * $perPage;

// Count total posts in category
$countStmt = $pdo->prepare("SELECT COUNT(*) FROM posts WHERE category_id = :cat_id AND status = 'published'");
$countStmt->execute(['cat_id' => $category['id']]);
$totalPosts = (int)$countStmt->fetchColumn();
$totalPages = max(1, (int)ceil($totalPosts / $perPage));

// Fetch paginated posts
$stmt = $pdo->prepare("
    SELECT p.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
           a.name AS author_name, a.avatar AS author_avatar, a.slug AS author_slug
    FROM posts p
    JOIN categories c ON p.category_id = c.id
    JOIN authors a ON p.author_id = a.id
    WHERE p.category_id = :cat_id AND p.status = 'published'
    ORDER BY p.published_at DESC
    LIMIT :limit OFFSET :offset
");
$stmt->bindValue(':cat_id', $category['id'], PDO::PARAM_INT);
$stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$categoryPosts = $stmt->fetchAll();
?>

<div class="category-page-wrapper">
    <!-- Category Header Banner -->
    <section class="category-header-section">
        <div class="container">
            <!-- Breadcrumbs -->
            <nav class="editorial-breadcrumbs" aria-label="Migas de pan">
                <ol>
                    <li><a href="<?= e($siteUrl) ?>/">Inicio</a></li>
                    <li><span class="breadcrumb-separator">/</span></li>
                    <li aria-current="page"><?= e($category['name']) ?></li>
                </ol>
            </nav>

            <div class="category-intro-box">
                <span class="category-pill" style="background-color: <?= e($category['color'] ?: '#2563eb') ?>">
                    Sección Editorial
                </span>
                <h1 class="category-page-title"><?= e($category['name']) ?></h1>
                <?php if (!empty($category['description'])): ?>
                    <p class="category-page-description"><?= e($category['description']) ?></p>
                <?php endif; ?>
                <div class="category-stats-badge">
                    <span><?= $totalPosts ?> <?= $totalPosts === 1 ? 'artículo publicado' : 'artículos publicados' ?></span>
                </div>
            </div>
        </div>
    </section>

    <!-- Articles Grid Section -->
    <section class="category-grid-section">
        <div class="container">
            <?php if (empty($categoryPosts)): ?>
                <div class="empty-category-box">
                    <p>No hay artículos publicados en esta categoría todavía.</p>
                    <a href="<?= e($siteUrl) ?>/" class="btn-primary">Volver a la portada</a>
                </div>
            <?php else: ?>
                <div class="articles-grid-3col">
                    <?php foreach ($categoryPosts as $post): ?>
                        <article class="standard-article-card">
                            <a href="<?= e($siteUrl) ?>/<?= e($post['category_slug']) ?>/<?= e($post['slug']) ?>/" class="article-card-inner">
                                <div class="article-card-media">
                                    <img src="<?= e($post['image']) ?>" alt="<?= e($post['image_alt'] ?: $post['title']) ?>" loading="lazy" width="400" height="240">
                                </div>
                                <div class="article-card-content">
                                    <h2 class="article-card-title"><?= e($post['title']) ?></h2>
                                    <p class="article-card-excerpt"><?= e($post['excerpt']) ?></p>
                                    <div class="article-card-footer">
                                        <span class="author-name"><?= e($post['author_name']) ?></span>
                                        <time class="post-date" datetime="<?= e($post['published_at']) ?>"><?= format_date($post['published_at']) ?></time>
                                    </div>
                                </div>
                            </a>
                        </article>
                    <?php endforeach; ?>
                </div>

                <!-- SEO Friendly Pagination -->
                <?php if ($totalPages > 1): ?>
                    <nav class="pagination-nav" aria-label="Paginación de <?= e($category['name']) ?>">
                        <div class="pagination-inner">
                            <?php if ($page > 1): ?>
                                <a href="<?= e($siteUrl) ?>/<?= e($category['slug']) ?>/<?= $page === 2 ? '' : 'page/' . ($page - 1) . '/' ?>" class="pagination-link prev-link">
                                    &larr; Anterior
                                </a>
                            <?php endif; ?>

                            <div class="pagination-numbers">
                                <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                                    <?php if ($i === $page): ?>
                                        <span class="pagination-link current" aria-current="page"><?= $i ?></span>
                                    <?php else: ?>
                                        <a href="<?= e($siteUrl) ?>/<?= e($category['slug']) ?>/<?= $i === 1 ? '' : 'page/' . $i . '/' ?>" class="pagination-link">
                                            <?= $i ?>
                                        </a>
                                    <?php endif; ?>
                                <?php endfor; ?>
                            </div>

                            <?php if ($page < $totalPages): ?>
                                <a href="<?= e($siteUrl) ?>/<?= e($category['slug']) ?>/page/<?= $page + 1 ?>/" class="pagination-link next-link">
                                    Siguiente &rarr;
                                </a>
                            <?php endif; ?>
                        </div>
                    </nav>
                <?php endif; ?>
            <?php endif; ?>
        </div>
    </section>
</div>
