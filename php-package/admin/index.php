<?php
/**
 * Admin Dashboard
 */

declare(strict_types=1);

$adminTitle = 'Dashboard Editorial';
require_once __DIR__ . '/includes/admin-header.php';

$pdo = DB::getConnection();

// Metrics
$totalPosts = (int)$pdo->query("SELECT COUNT(*) FROM posts")->fetchColumn();
$publishedPosts = (int)$pdo->query("SELECT COUNT(*) FROM posts WHERE status = 'published'")->fetchColumn();
$draftPosts = (int)$pdo->query("SELECT COUNT(*) FROM posts WHERE status = 'draft'")->fetchColumn();
$totalViews = (int)$pdo->query("SELECT SUM(views) FROM posts")->fetchColumn();
$totalCategories = (int)$pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
$totalAuthors = (int)$pdo->query("SELECT COUNT(*) FROM authors")->fetchColumn();

// Recent 6 posts
$recentStmt = $pdo->query("
    SELECT p.*, c.name AS category_name, c.color AS category_color, a.name AS author_name
    FROM posts p
    JOIN categories c ON p.category_id = c.id
    JOIN authors a ON p.author_id = a.id
    ORDER BY p.id DESC
    LIMIT 6
");
$recentPosts = $recentStmt->fetchAll();
?>

<div class="dashboard-wrapper">
    <!-- Stat Cards Grid -->
    <div class="dashboard-stats-grid">
        <div class="stat-card">
            <div class="stat-icon-wrap blue">📰</div>
            <div class="stat-info">
                <span class="stat-value"><?= $totalPosts ?></span>
                <span class="stat-label">Total de Artículos</span>
            </div>
            <div class="stat-meta">
                <span class="stat-sub published"><?= $publishedPosts ?> Publicados</span>
                <span class="stat-sub draft"><?= $draftPosts ?> Borradores</span>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon-wrap green">👁️</div>
            <div class="stat-info">
                <span class="stat-value"><?= number_format($totalViews) ?></span>
                <span class="stat-label">Lecturas / Vistas</span>
            </div>
            <div class="stat-meta">
                <span class="stat-sub">Tráfico Orgánico</span>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon-wrap purple">📁</div>
            <div class="stat-info">
                <span class="stat-value"><?= $totalCategories ?></span>
                <span class="stat-label">Categorías Activas</span>
            </div>
            <div class="stat-meta">
                <a href="<?= e($siteUrl) ?>/admin/categories.php" class="stat-link">Gestionar &rarr;</a>
            </div>
        </div>

        <div class="stat-card">
            <div class="stat-icon-wrap amber">✍️</div>
            <div class="stat-info">
                <span class="stat-value"><?= $totalAuthors ?></span>
                <span class="stat-label">Autores / Redactores</span>
            </div>
            <div class="stat-meta">
                <a href="<?= e($siteUrl) ?>/admin/authors.php" class="stat-link">Ver equipo &rarr;</a>
            </div>
        </div>
    </div>

    <!-- Quick Actions Banner -->
    <div class="dashboard-quick-actions">
        <div class="quick-action-text">
            <h3>Centro de Redacción Rápida</h3>
            <p>Publica una nueva noticia con optimización SEO automática y asignación a portada.</p>
        </div>
        <div class="quick-action-buttons">
            <a href="<?= e($siteUrl) ?>/admin/post-edit.php" class="btn-primary">+ Redactar Nueva Noticia</a>
            <a href="<?= e($siteUrl) ?>/admin/media.php" class="btn-secondary">Subir Imágenes</a>
            <a href="<?= e($siteUrl) ?>/admin/seo.php" class="btn-outline">Ver Sitemaps & SEO</a>
        </div>
    </div>

    <!-- Recent Posts Table -->
    <div class="admin-card-box">
        <div class="admin-card-header">
            <h2 class="admin-card-title">Últimas Publicaciones en el Portal</h2>
            <a href="<?= e($siteUrl) ?>/admin/posts.php" class="admin-header-link">Ver todas las noticias &rarr;</a>
        </div>

        <div class="table-responsive">
            <table class="admin-data-table">
                <thead>
                    <tr>
                        <th>Artículo</th>
                        <th>Categoría</th>
                        <th>Autor</th>
                        <th>Estado</th>
                        <th>Vistas</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($recentPosts)): ?>
                        <tr><td colspan="7" class="text-center py-4">No hay publicaciones registradas aún.</td></tr>
                    <?php else: ?>
                        <?php foreach ($recentPosts as $p): ?>
                            <tr>
                                <td>
                                    <div class="table-post-cell">
                                        <img src="<?= e($p['image']) ?>" alt="" class="table-post-thumb" width="48" height="36">
                                        <div>
                                            <a href="<?= e($siteUrl) ?>/admin/post-edit.php?id=<?= $p['id'] ?>" class="table-post-title">
                                                <?= e($p['title']) ?>
                                            </a>
                                            <?php if ($p['is_hero']): ?>
                                                <span class="badge-flag hero">PORTADA HERO</span>
                                            <?php endif; ?>
                                            <?php if ($p['is_featured']): ?>
                                                <span class="badge-flag featured">DESTACADO</span>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="category-pill-sm" style="border-left: 3px solid <?= e($p['category_color'] ?: '#2563eb') ?>">
                                        <?= e($p['category_name']) ?>
                                    </span>
                                </td>
                                <td><?= e($p['author_name']) ?></td>
                                <td>
                                    <span class="status-badge <?= $p['status'] === 'published' ? 'published' : 'draft' ?>">
                                        <?= $p['status'] === 'published' ? 'Publicado' : 'Borrador' ?>
                                    </span>
                                </td>
                                <td><?= number_format((int)$p['views']) ?></td>
                                <td><small><?= format_date($p['published_at']) ?></small></td>
                                <td>
                                    <div class="table-actions-group">
                                        <a href="<?= e($siteUrl) ?>/admin/post-edit.php?id=<?= $p['id'] ?>" class="action-btn edit" title="Editar">✏️</a>
                                        <a href="<?= e($siteUrl) ?>/<?= e($p['category_id']) ?>/<?= e($p['slug']) ?>/" target="_blank" class="action-btn view" title="Ver en web">👁️</a>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin-footer.php'; ?>
