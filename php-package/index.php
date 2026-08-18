<?php
/**
 * Front Controller & Clean URL Router
 * Handles all clean URLs: /, /{cat}/, /{cat}/page/{n}/, /{cat}/{slug}/, /autor/{slug}/, /buscar/
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/functions.php';

$pdo = DB::getConnection();
$siteUrl = rtrim(SITE_URL, '/');

// Parse request URI
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptName !== '/' && str_starts_with($requestUri, $scriptName)) {
    $requestUri = substr($requestUri, strlen($scriptName));
}
$path = trim($requestUri, '/');
$segments = $path === '' ? [] : explode('/', $path);

// Global view variables
$pageTitle = null;
$pageDesc = null;
$canonicalUrl = null;
$ogImage = null;
$ogType = 'website';
$robots = 'index, follow';
$schemaJsonLd = null;
$currentCategorySlug = null;
$isSingle = false;
$isAuthor = false;

// 1. HOME ROUTE: /
if (empty($segments)) {
    $pageTitle = get_setting('site_name', 'PULSO EDITORIAL') . ' | ' . get_setting('site_tagline', 'Periodismo Riguroso');
    $pageDesc = get_setting('site_description', 'Portal de noticias y revista digital.');
    $canonicalUrl = $siteUrl . '/';
    
    $schemaJsonLd = [
        "@context" => "https://schema.org",
        "@type" => "NewsMediaOrganization",
        "name" => get_setting('site_name', 'PULSO EDITORIAL'),
        "url" => $siteUrl,
        "logo" => $siteUrl . '/assets/img/logo.png',
        "description" => $pageDesc
    ];

    require_once __DIR__ . '/includes/header.php';
    require_once __DIR__ . '/templates/home.php';
    require_once __DIR__ . '/includes/footer.php';
    exit;
}

// 2. SEARCH ROUTE: /buscar/
if ($segments[0] === 'buscar') {
    $query = trim($_GET['q'] ?? '');
    $pageTitle = ($query ? 'Búsqueda: ' . $query . ' | ' : 'Buscar en ') . get_setting('site_name', 'PULSO EDITORIAL');
    $pageDesc = 'Resultados de búsqueda en ' . get_setting('site_name', 'PULSO EDITORIAL');
    $canonicalUrl = $siteUrl . '/buscar/' . ($query ? '?q=' . urlencode($query) : '');
    $robots = 'noindex, follow';

    require_once __DIR__ . '/includes/header.php';
    require_once __DIR__ . '/templates/search.php';
    require_once __DIR__ . '/includes/footer.php';
    exit;
}

// 3. AUTHOR ROUTE: /autor/{slug}/
if ($segments[0] === 'autor' && isset($segments[1])) {
    $authorSlug = $segments[1];
    $stmt = $pdo->prepare("SELECT * FROM authors WHERE slug = :slug LIMIT 1");
    $stmt->execute(['slug' => $authorSlug]);
    $author = $stmt->fetch();

    if ($author) {
        $isAuthor = true;
        $pageTitle = $author['name'] . ' - Perfil Editorial | ' . get_setting('site_name');
        $pageDesc = $author['bio'] ?: ('Artículos y reportajes publicados por ' . $author['name']);
        $canonicalUrl = $siteUrl . '/autor/' . $author['slug'] . '/';
        $ogImage = $author['avatar'] ?: ($siteUrl . '/assets/img/og-default.jpg');

        $schemaJsonLd = [
            "@context" => "https://schema.org",
            "@type" => "Person",
            "name" => $author['name'],
            "jobTitle" => $author['role_title'] ?? 'Periodista',
            "description" => $author['bio'],
            "image" => $author['avatar'],
            "url" => $canonicalUrl
        ];

        require_once __DIR__ . '/includes/header.php';
        require_once __DIR__ . '/templates/author.php';
        require_once __DIR__ . '/includes/footer.php';
        exit;
    }
}

// 4. CATEGORY OR POST ROUTE
$firstSegment = $segments[0];

// Check if first segment is a valid category
$stmt = $pdo->prepare("SELECT * FROM categories WHERE slug = :slug AND status = 'active' LIMIT 1");
$stmt->execute(['slug' => $firstSegment]);
$category = $stmt->fetch();

if ($category) {
    $currentCategorySlug = $category['slug'];

    // Sub-case A: Category Pagination: /{cat}/page/{n}/
    if (count($segments) === 3 && $segments[1] === 'page') {
        $currentPageNumber = (int)$segments[2];
        $pageTitle = ($category['seo_title'] ?: $category['name']) . ' - Página ' . $currentPageNumber . ' | ' . get_setting('site_name');
        $pageDesc = $category['meta_description'] ?: $category['description'];
        $canonicalUrl = $siteUrl . '/' . $category['slug'] . '/page/' . $currentPageNumber . '/';

        require_once __DIR__ . '/includes/header.php';
        require_once __DIR__ . '/templates/category.php';
        require_once __DIR__ . '/includes/footer.php';
        exit;
    }

    // Sub-case B: Category Home: /{cat}/
    if (count($segments) === 1) {
        $currentPageNumber = 1;
        $pageTitle = ($category['seo_title'] ?: $category['name']) . ' | ' . get_setting('site_name');
        $pageDesc = $category['meta_description'] ?: $category['description'];
        $canonicalUrl = $siteUrl . '/' . $category['slug'] . '/';

        $schemaJsonLd = [
            "@context" => "https://schema.org",
            "@type" => "CollectionPage",
            "name" => $category['name'],
            "description" => $pageDesc,
            "url" => $canonicalUrl
        ];

        require_once __DIR__ . '/includes/header.php';
        require_once __DIR__ . '/templates/category.php';
        require_once __DIR__ . '/includes/footer.php';
        exit;
    }

    // Sub-case C: Single Post Detail: /{cat}/{post_slug}/
    if (count($segments) === 2) {
        $postSlug = $segments[1];
        $postStmt = $pdo->prepare("
            SELECT p.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
                   a.name AS author_name, a.slug AS author_slug, a.avatar AS author_avatar,
                   a.bio AS author_bio, a.role_title AS author_role, a.twitter AS author_twitter, a.linkedin AS author_linkedin
            FROM posts p
            JOIN categories c ON p.category_id = c.id
            JOIN authors a ON p.author_id = a.id
            WHERE p.slug = :slug AND p.category_id = :cat_id AND p.status = 'published'
            LIMIT 1
        ");
        $postStmt->execute([
            'slug'   => $postSlug,
            'cat_id' => $category['id']
        ]);
        $post = $postStmt->fetch();

        if ($post) {
            $isSingle = true;
            $pageTitle = ($post['seo_title'] ?: $post['title']) . ' | ' . get_setting('site_name');
            $pageDesc = $post['meta_description'] ?: $post['excerpt'];
            $canonicalUrl = $post['canonical_url'] ?: ($siteUrl . '/' . $category['slug'] . '/' . $post['slug'] . '/');
            $ogImage = $post['image'];
            $ogType = 'article';
            $robots = $post['robots'] ?: 'index, follow';

            // Schema.org NewsArticle & BreadcrumbList
            $schemaJsonLd = [
                "@context" => "https://schema.org",
                "@graph" => [
                    [
                        "@type" => "NewsArticle",
                        "headline" => $post['title'],
                        "description" => $post['excerpt'],
                        "image" => [$post['image']],
                        "datePublished" => date('c', strtotime($post['published_at'])),
                        "dateModified" => date('c', strtotime($post['updated_at'] ?? $post['published_at'])),
                        "mainEntityOfPage" => [
                            "@type" => "WebPage",
                            "@id" => $canonicalUrl
                        ],
                        "author" => [
                            "@type" => "Person",
                            "name" => $post['author_name'],
                            "url" => $siteUrl . '/autor/' . $post['author_slug'] . '/'
                        ],
                        "publisher" => [
                            "@type" => "Organization",
                            "name" => get_setting('site_name', 'PULSO EDITORIAL'),
                            "url" => $siteUrl,
                            "logo" => [
                                "@type" => "ImageObject",
                                "url" => $siteUrl . '/assets/img/logo.png'
                            ]
                        ],
                        "articleSection" => $category['name']
                    ],
                    [
                        "@type" => "BreadcrumbList",
                        "itemListElement" => [
                            [
                                "@type" => "ListItem",
                                "position" => 1,
                                "name" => "Inicio",
                                "item" => $siteUrl . '/'
                            ],
                            [
                                "@type" => "ListItem",
                                "position" => 2,
                                "name" => $category['name'],
                                "item" => $siteUrl . '/' . $category['slug'] . '/'
                            ],
                            [
                                "@type" => "ListItem",
                                "position" => 3,
                                "name" => $post['title'],
                                "item" => $canonicalUrl
                            ]
                        ]
                    ]
                ]
            ];

            require_once __DIR__ . '/includes/header.php';
            require_once __DIR__ . '/templates/single.php';
            require_once __DIR__ . '/includes/footer.php';
            exit;
        }
    }
}

// 5. 404 NOT FOUND
header("HTTP/1.0 404 Not Found");
$pageTitle = 'Página no encontrada (404) | ' . get_setting('site_name');
$pageDesc = 'La página solicitada no existe.';
$robots = 'noindex, nofollow';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/templates/404.php';
require_once __DIR__ . '/includes/footer.php';
