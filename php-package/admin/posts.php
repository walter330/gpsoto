<?php
/**
 * Admin Posts Manager
 */

declare(strict_types=1);

$adminTitle = 'Gestión de Noticias y Artículos';
require_once __DIR__ . '/includes/admin-header.php';

$pdo = DB::getConnection();

// Handle Delete Post Action
if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $token = $_GET['token'] ?? '';
    if (verify_csrf_token($token)) {
        $delStmt = $pdo->prepare("DELETE FROM posts WHERE id = :id");
        $delStmt->execute(['id' => $id]);
        $_SESSION['flash_message'] = 'Artículo eliminado correctamente.';
        $_SESSION['flash_type'] = 'success';
        header("Location: " . $siteUrl . "/admin/posts.php");
        exit;
    }
}

// Filters
$catFilter = isset($_GET['cat']) ? (int)$_GET['cat'] : 0;
$statusFilter = trim($_GET['status'] ?? '');
$searchQuery = trim($_GET['s'] ?? '');

$sql = "
    SELECT p.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
           a.name AS author_name
    FROM posts p
    JOIN categories c ON p.category_id = c.id
    JOIN authors a ON p.author_id = a.id
    WHERE 1=1
";
$params = [];

if ($catFilter > 0) {
    $sql .= " AND p.category_id = :cat_id";
    $params['cat_id'] = $catFilter;
}
if ($statusFilter === 'published' || $statusFilter === 'draft') {
    $sql .= " AND p.status = :status";
    $params['status'] = $statusFilter;
}
if (!empty($searchQuery)) {
    $sql .= " AND (p.title LIKE :q OR p.excerpt LIKE :q)";
    $params['q'] = '%' . $searchQuery . '%';
}

$sql .= " ORDER BY p.published_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$posts = $stmt->fetchAll();

$categories = get_categories();
?>

<div class="admin-posts-wrapper">
    <!-- Top Filter Bar -->
    <div class="admin-filter-bar">
        <form action="" method="GET" class="filter-form">
            <div class="filter-group">
                <input type="text" name="s" value="<?= e($searchQuery) ?>" placeholder="Buscar por título o extracto...">
            </div>

            <div class="filter-group">
                <select name="cat">
                    <option value="0">Todas las Categorías</option>
                    <?php foreach ($categories as $cat): ?>
                        <option value="<?= $cat['id'] ?>" <?= $catFilter === (int)$cat['id'] ? 'selected' : '' ?>>
                            <?= e($cat['name']) ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="filter-group">
                <select name="status">
                    <option value="">Todos los Estados</option>
                    <option value="published" <?= $statusFilter === 'published' ? 'selected' : '' ?>>Publicados</option>
                    <option value="draft" <?= $statusFilter === 'draft' ? 'selected' : '' ?>>Borradores</option>
                </select>
            </div>

            <button type="submit" class="btn-primary btn-sm">Filtrar</button>
            <?php if ($catFilter || $statusFilter || $searchQuery): ?>
                <a href="<?= e($siteUrl) ?>/admin/posts.php" class="btn-outline btn-sm">Limpiar</a>
            <?php endif; ?>
        </form>

        <a href="<?= e($siteUrl) ?>/admin/post-edit.php" class="btn-primary">+ Nueva Noticia</a>
    </div>

    <!-- Posts Table -->
    <div class="admin-card-box">
        <div class="table-responsive">
            <table class="admin-data-table">
                <thead>
                    <tr>
                        <th style="width: 40%">Título & Flags</th>
                        <th>Categoría</th>
                        <th>Autor</th>
                        <th>Estado</th>
                        <th>Vistas</th>
                        <th>Publicación</th>
                        <th style="text-align: right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($posts)): ?>
                        <tr><td colspan="7" class="text-center py-5">No se encontraron artículos con los filtros aplicados.</td></tr>
                    <?php else: ?>
                        <?php foreach ($posts as $p): ?>
                            <tr>
                                <td>
                                    <div class="table-post-cell">
                                        <img src="<?= e($p['image']) ?>" alt="" class="table-post-thumb" width="48" height="36">
                                        <div>
                                            <a href="<?= e($siteUrl) ?>/admin/post-edit.php?id=<?= $p['id'] ?>" class="table-post-title">
                                                <?= e($p['title']) ?>
                                            </a>
                                            <div class="table-post-badges">
                                                <?php if ($p['is_hero']): ?>
                                                    <span class="badge-flag hero">HERO PORTADA</span>
                                                <?php endif; ?>
                                                <?php if ($p['is_featured']): ?>
                                                    <span class="badge-flag featured">DESTACADO</span>
                                                <?php endif; ?>
                                            </div>
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
                                <td style="text-align: right">
                                    <div class="table-actions-group" style="justify-content: flex-end;">
                                        <a href="<?= e($siteUrl) ?>/admin/post-edit.php?id=<?= $p['id'] ?>" class="action-btn edit" title="Editar">✏️</a>
                                        <a href="<?= e($siteUrl) ?>/<?= e($p['category_slug']) ?>/<?= e($p['slug']) ?>/" target="_blank" class="action-btn view" title="Ver en portal">👁️</a>
                                        <a href="<?= e($siteUrl) ?>/admin/posts.php?action=delete&id=<?= $p['id'] ?>&token=<?= e(generate_csrf_token()) ?>" 
                                           class="action-btn delete" 
                                           onclick="return confirm('¿Estás seguro de eliminar este artículo permanentemente?');" 
                                           title="Eliminar">🗑️</a>
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
