<?php
/**
 * Home Page Template (Magazine / Editorial Style inspired by MyFitnessPal)
 */

declare(strict_types=1);

$siteUrl = rtrim(SITE_URL, '/');
$pdo = DB::getConnection();

// 1. Fetch Hero Post
$stmt = $pdo->prepare("
    SELECT p.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
           a.name AS author_name, a.avatar AS author_avatar, a.slug AS author_slug
    FROM posts p
    JOIN categories c ON p.category_id = c.id
    JOIN authors a ON p.author_id = a.id
    WHERE p.status = 'published' AND p.is_hero = 1
    ORDER BY p.published_at DESC
    LIMIT 1
");
$stmt->execute();
$heroPost = $stmt->fetch();

// Fallback if no specific hero flag is set: get the newest post
if (!$heroPost) {
    $stmt = $pdo->prepare("
        SELECT p.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
               a.name AS author_name, a.avatar AS author_avatar, a.slug AS author_slug
        FROM posts p
        JOIN categories c ON p.category_id = c.id
        JOIN authors a ON p.author_id = a.id
        WHERE p.status = 'published'
        ORDER BY p.published_at DESC
        LIMIT 1
    ");
    $stmt->execute();
    $heroPost = $stmt->fetch();
}

$heroId = $heroPost['id'] ?? 0;

// 2. Fetch 3 Secondary Stories (beside the Hero)
$stmt = $pdo->prepare("
    SELECT p.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
           a.name AS author_name, a.avatar AS author_avatar, a.slug AS author_slug
    FROM posts p
    JOIN categories c ON p.category_id = c.id
    JOIN authors a ON p.author_id = a.id
    WHERE p.status = 'published' AND p.id != :hero_id
    ORDER BY p.published_at DESC
    LIMIT 3
");
$stmt->execute(['hero_id' => $heroId]);
$secondaryPosts = $stmt->fetchAll();

// 3. Fetch Featured Stories (for the Horizontal Carousel / Strip)
$stmt = $pdo->prepare("
    SELECT p.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color
    FROM posts p
    JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'published' AND p.is_featured = 1
    ORDER BY p.published_at DESC
    LIMIT 6
");
$stmt->execute();
$featuredPosts = $stmt->fetchAll();

// 4. Fetch Latest News (3-column grid)
$stmt = $pdo->prepare("
    SELECT p.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
           a.name AS author_name, a.avatar AS author_avatar, a.slug AS author_slug
    FROM posts p
    JOIN categories c ON p.category_id = c.id
    JOIN authors a ON p.author_id = a.id
    WHERE p.status = 'published'
    ORDER BY p.published_at DESC
    LIMIT 6
");
$stmt->execute();
$latestPosts = $stmt->fetchAll();

// 5. Fetch Posts for Category Blocks
$categoriesList = get_categories();
$categoryBlocks = [];
foreach ($categoriesList as $cat) {
    $stmt = $pdo->prepare("
        SELECT p.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
               a.name AS author_name, a.slug AS author_slug
        FROM posts p
        JOIN categories c ON p.category_id = c.id
        JOIN authors a ON p.author_id = a.id
        WHERE p.status = 'published' AND p.category_id = :cat_id
        ORDER BY p.published_at DESC
        LIMIT 4
    ");
    $stmt->execute(['cat_id' => $cat['id']]);
    $catPosts = $stmt->fetchAll();
    if (!empty($catPosts)) {
        $categoryBlocks[] = [
            'category' => $cat,
            'posts' => $catPosts
        ];
    }
}
?>

<div class="home-wrapper">

    <!-- HERO SECTION (MyFitnessPal Style: Big Cover + Side Columns) -->
    <?php if ($heroPost): ?>
    <section class="hero-section">
        <div class="container">
            <div class="hero-grid">
                <!-- Main Lead Hero Card -->
                <article class="hero-main-card">
                    <a href="<?= e($siteUrl) ?>/<?= e($heroPost['category_slug']) ?>/<?= e($heroPost['slug']) ?>/" class="hero-card-link">
                        <div class="hero-image-wrap">
                            <img src="<?= e($heroPost['image']) ?>" alt="<?= e($heroPost['image_alt'] ?: $heroPost['title']) ?>" class="hero-img" width="800" height="480">
                            <span class="category-badge" style="background-color: <?= e($heroPost['category_color'] ?: '#2563eb') ?>">
                                <?= e($heroPost['category_name']) ?>
                            </span>
                        </div>
                        <div class="hero-card-body">
                            <h1 class="hero-title"><?= e($heroPost['title']) ?></h1>
                            <p class="hero-excerpt"><?= e($heroPost['excerpt']) ?></p>
                            <div class="article-meta">
                                <span class="author-name"><?= e($heroPost['author_name']) ?></span>
                                <span class="meta-dot">&bull;</span>
                                <time datetime="<?= e($heroPost['published_at']) ?>"><?= format_date($heroPost['published_at']) ?></time>
                                <span class="meta-dot">&bull;</span>
                                <span class="read-time"><?= estimate_reading_time($heroPost['content']) ?> min de lectura</span>
                            </div>
                        </div>
                    </a>
                </article>

                <!-- Secondary Top Stories Column -->
                <div class="hero-side-column">
                    <div class="side-column-header">
                        <span class="side-column-title">Destacadas de Hoy</span>
                    </div>
                    <div class="side-stories-list">
                        <?php foreach ($secondaryPosts as $sec): ?>
                            <article class="side-story-item">
                                <a href="<?= e($siteUrl) ?>/<?= e($sec['category_slug']) ?>/<?= e($sec['slug']) ?>/" class="side-story-link">
                                    <div class="side-story-thumb">
                                        <img src="<?= e($sec['image']) ?>" alt="<?= e($sec['image_alt'] ?: $sec['title']) ?>" loading="lazy" width="120" height="85">
                                    </div>
                                    <div class="side-story-content">
                                        <span class="side-category" style="color: <?= e($sec['category_color'] ?: '#2563eb') ?>"><?= e($sec['category_name']) ?></span>
                                        <h2 class="side-story-title"><?= e($sec['title']) ?></h2>
                                        <time class="side-date" datetime="<?= e($sec['published_at']) ?>"><?= format_date($sec['published_at']) ?></time>
                                    </div>
                                </a>
                            </article>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- FEATURED HORIZONTAL STORIES (MyFitnessPal Scroll Concept) -->
    <?php if (!empty($featuredPosts)): ?>
    <section class="featured-strip-section">
        <div class="container">
            <div class="section-heading-row">
                <div class="heading-title-group">
                    <span class="section-tag">Tendencias</span>
                    <h2 class="section-title">Artículos Destacados</h2>
                </div>
                <div class="slider-arrows-nav">
                    <button class="slider-arrow prev" id="slideLeftBtn" aria-label="Desplazar a la izquierda">&larr;</button>
                    <button class="slider-arrow next" id="slideRightBtn" aria-label="Desplazar a la derecha">&rarr;</button>
                </div>
            </div>

            <div class="horizontal-scroll-container" id="featuredScrollContainer">
                <?php foreach ($featuredPosts as $feat): ?>
                    <article class="featured-scroll-card">
                        <a href="<?= e($siteUrl) ?>/<?= e($feat['category_slug']) ?>/<?= e($feat['slug']) ?>/" class="scroll-card-link">
                            <div class="scroll-card-image">
                                <img src="<?= e($feat['image']) ?>" alt="<?= e($feat['title']) ?>" loading="lazy" width="320" height="200">
                                <span class="category-badge small" style="background-color: <?= e($feat['category_color'] ?: '#2563eb') ?>">
                                    <?= e($feat['category_name']) ?>
                                </span>
                            </div>
                            <h3 class="scroll-card-title"><?= e($feat['title']) ?></h3>
                        </a>
                    </article>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- LATEST ARTICLES GRID (3 Columns Desktop, 2 Tablet, 1 Mobile) -->
    <section class="latest-news-section">
        <div class="container">
            <div class="section-heading-row">
                <div class="heading-title-group">
                    <span class="section-tag">Actualización Continua</span>
                    <h2 class="section-title">Últimas Noticias</h2>
                </div>
                <span class="editorial-divider-line"></span>
            </div>

            <div class="articles-grid-3col">
                <?php foreach ($latestPosts as $post): ?>
                    <article class="standard-article-card">
                        <a href="<?= e($siteUrl) ?>/<?= e($post['category_slug']) ?>/<?= e($post['slug']) ?>/" class="article-card-inner">
                            <div class="article-card-media">
                                <img src="<?= e($post['image']) ?>" alt="<?= e($post['image_alt'] ?: $post['title']) ?>" loading="lazy" width="400" height="240">
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
        </div>
    </section>

    <!-- CATEGORY EDITORIAL BLOCKS (1 Large Feature + 3 Compact Stories per category) -->
    <?php foreach ($categoryBlocks as $block): 
        $cat = $block['category'];
        $catPosts = $block['posts'];
        $catLead = $catPosts[0] ?? null;
        $catSub = array_slice($catPosts, 1, 3);
    ?>
    <section class="category-block-section">
        <div class="container">
            <div class="section-heading-row">
                <div class="heading-title-group">
                    <span class="section-tag" style="color: <?= e($cat['color'] ?: '#2563eb') ?>">Sección</span>
                    <h2 class="section-title"><?= e($cat['name']) ?></h2>
                </div>
                <a href="<?= e($siteUrl) ?>/<?= e($cat['slug']) ?>/" class="view-all-category-link">
                    Ver todos en <?= e($cat['name']) ?> &rarr;
                </a>
            </div>

            <div class="category-magazine-layout">
                <!-- Left: Big Lead Card -->
                <?php if ($catLead): ?>
                <div class="cat-lead-column">
                    <article class="cat-lead-card">
                        <a href="<?= e($siteUrl) ?>/<?= e($catLead['category_slug']) ?>/<?= e($catLead['slug']) ?>/" class="cat-lead-link">
                            <div class="cat-lead-image">
                                <img src="<?= e($catLead['image']) ?>" alt="<?= e($catLead['title']) ?>" loading="lazy" width="600" height="360">
                            </div>
                            <div class="cat-lead-body">
                                <h3 class="cat-lead-title"><?= e($catLead['title']) ?></h3>
                                <p class="cat-lead-excerpt"><?= e($catLead['excerpt']) ?></p>
                                <div class="article-meta">
                                    <span class="author-name"><?= e($catLead['author_name']) ?></span>
                                    <span class="meta-dot">&bull;</span>
                                    <time datetime="<?= e($catLead['published_at']) ?>"><?= format_date($catLead['published_at']) ?></time>
                                </div>
                            </div>
                        </a>
                    </article>
                </div>
                <?php endif; ?>

                <!-- Right: 3 Stacked Stories -->
                <div class="cat-sub-column">
                    <div class="cat-sub-list">
                        <?php foreach ($catSub as $sub): ?>
                            <article class="cat-sub-item">
                                <a href="<?= e($siteUrl) ?>/<?= e($sub['category_slug']) ?>/<?= e($sub['slug']) ?>/" class="cat-sub-link">
                                    <div class="cat-sub-thumb">
                                        <img src="<?= e($sub['image']) ?>" alt="<?= e($sub['title']) ?>" loading="lazy" width="140" height="95">
                                    </div>
                                    <div class="cat-sub-info">
                                        <h4 class="cat-sub-title"><?= e($sub['title']) ?></h4>
                                        <time class="cat-sub-date" datetime="<?= e($sub['published_at']) ?>"><?= format_date($sub['published_at']) ?></time>
                                    </div>
                                </a>
                            </article>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <?php endforeach; ?>

    <!-- EDITORIAL NEWSLETTER CTA -->
    <section class="editorial-cta-section">
        <div class="container">
            <div class="cta-inner-box">
                <div class="cta-content">
                    <span class="cta-badge">Suscripción Gratuita</span>
                    <h2 class="cta-title">El análisis editorial directo en tu bandeja de entrada</h2>
                    <p class="cta-desc">Únete a más de 25,000 lectores que reciben cada mañana nuestro resumen curado de noticias, economía y tecnología.</p>
                </div>
                <form class="cta-form" onsubmit="event.preventDefault(); alert('¡Gracias por registrarte a la edición matutina!');">
                    <input type="email" placeholder="Ingresa tu correo institucional o personal..." required>
                    <button type="submit" class="btn-primary large">Suscribirme ahora</button>
                </form>
            </div>
        </div>
    </section>

</div>
