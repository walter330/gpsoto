<?php
/**
 * Search Results Template
 */

declare(strict_types=1);

$siteUrl = rtrim(SITE_URL, '/');
$pdo = DB::getConnection();

$query = trim($_GET['q'] ?? '');
$searchResults = [];

if (!empty($query)) {
    $searchTerm = '%' . $query . '%';
    $stmt = $pdo->prepare("
        SELECT p.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
               a.name AS author_name, a.slug AS author_slug
        FROM posts p
        JOIN categories c ON p.category_id = c.id
        JOIN authors a ON p.author_id = a.id
        WHERE p.status = 'published' AND (p.title LIKE :q1 OR p.excerpt LIKE :q2 OR p.content LIKE :q3)
        ORDER BY p.published_at DESC
        LIMIT 24
    ");
    $stmt->execute([
        'q1' => $searchTerm,
        'q2' => $searchTerm,
        'q3' => $searchTerm
    ]);
    $searchResults = $stmt->fetchAll();
}
$resultCount = count($searchResults);
?>

<div class="search-page-wrapper">
    <section class="search-header-section">
        <div class="container">
            <nav class="editorial-breadcrumbs" aria-label="Migas de pan">
                <ol>
                    <li><a href="<?= e($siteUrl) ?>/">Inicio</a></li>
                    <li><span class="breadcrumb-separator">/</span></li>
                    <li aria-current="page">Búsqueda</li>
                </ol>
            </nav>

            <div class="search-title-box">
                <h1 class="search-page-heading">Resultados de búsqueda</h1>
                <p class="search-subheading">
                    <?php if (!empty($query)): ?>
                        Se encontraron <strong><?= $resultCount ?></strong> resultados para "<strong><?= e($query) ?></strong>"
                    <?php else: ?>
                        Introduce un término de búsqueda para explorar el portal.
                    <?php endif; ?>
                </p>

                <form action="<?= e($siteUrl) ?>/buscar/" method="GET" class="search-page-form">
                    <input type="text" name="q" value="<?= e($query) ?>" placeholder="Buscar por tema o título..." required>
                    <button type="submit" class="btn-primary">Buscar de nuevo</button>
                </form>
            </div>
        </div>
    </section>

    <section class="search-results-section">
        <div class="container">
            <?php if (!empty($query) && empty($searchResults)): ?>
                <div class="empty-search-box">
                    <p>No se encontraron artículos que coincidan con tu búsqueda.</p>
                    <p>Intenta con palabras clave más generales como <em>"energía"</em>, <em>"economía"</em> o <em>"tecnología"</em>.</p>
                </div>
            <?php else: ?>
                <div class="articles-grid-3col">
                    <?php foreach ($searchResults as $post): ?>
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
                                        <span class="author-name"><?= e($post['author_name']) ?></span>
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
