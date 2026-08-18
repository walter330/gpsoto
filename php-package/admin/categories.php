<?php
/**
 * Categories CRUD Admin
 */

declare(strict_types=1);

$adminTitle = 'Gestión de Categorías';
require_once __DIR__ . '/includes/admin-header.php';

$pdo = DB::getConnection();
$error = '';
$editingCategory = null;

// Handle Delete
if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $token = $_GET['token'] ?? '';
    if (verify_csrf_token($token)) {
        // Prevent deleting if it's the only category
        $count = (int)$pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
        if ($count > 1) {
            $stmt = $pdo->prepare("DELETE FROM categories WHERE id = :id");
            $stmt->execute(['id' => $id]);
            $_SESSION['flash_message'] = 'Categoría eliminada con éxito.';
            $_SESSION['flash_type'] = 'success';
        } else {
            $_SESSION['flash_message'] = 'No puedes eliminar la única categoría del sistema.';
            $_SESSION['flash_type'] = 'error';
        }
        header("Location: " . $siteUrl . "/admin/categories.php");
        exit;
    }
}

// Handle Edit Mode Load
if (isset($_GET['edit'])) {
    $id = (int)$_GET['edit'];
    $stmt = $pdo->prepare("SELECT * FROM categories WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => $id]);
    $editingCategory = $stmt->fetch();
}

// Handle Form Submission (Create or Update)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf_token'] ?? '';
    if (!verify_csrf_token($token)) {
        $error = 'Error de seguridad CSRF.';
    } else {
        $name = trim($_POST['name'] ?? '');
        $slug = slugify(trim($_POST['slug'] ?? $name));
        $desc = trim($_POST['description'] ?? '');
        $seoTitle = trim($_POST['seo_title'] ?? '');
        $metaDesc = trim($_POST['meta_description'] ?? '');
        $color = trim($_POST['color'] ?? '#2563eb');
        $status = $_POST['status'] === 'inactive' ? 'inactive' : 'active';
        $editId = isset($_POST['edit_id']) ? (int)$_POST['edit_id'] : 0;

        if (empty($name)) {
            $error = 'El nombre de la categoría es obligatorio.';
        } else {
            try {
                if ($editId > 0) {
                    $stmt = $pdo->prepare("
                        UPDATE categories SET
                            name = :name, slug = :slug, description = :description,
                            seo_title = :seo_title, meta_description = :meta_description,
                            color = :color, status = :status
                        WHERE id = :id
                    ");
                    $stmt->execute([
                        'name'             => $name,
                        'slug'             => $slug,
                        'description'      => $desc,
                        'seo_title'        => $seoTitle,
                        'meta_description' => $metaDesc,
                        'color'            => $color,
                        'status'           => $status,
                        'id'               => $editId
                    ]);
                    $_SESSION['flash_message'] = 'Categoría actualizada exitosamente.';
                } else {
                    $stmt = $pdo->prepare("
                        INSERT INTO categories (name, slug, description, seo_title, meta_description, color, status)
                        VALUES (:name, :slug, :description, :seo_title, :meta_description, :color, :status)
                    ");
                    $stmt->execute([
                        'name'             => $name,
                        'slug'             => $slug,
                        'description'      => $desc,
                        'seo_title'        => $seoTitle,
                        'meta_description' => $metaDesc,
                        'color'            => $color,
                        'status'           => $status
                    ]);
                    $_SESSION['flash_message'] = 'Categoría creada exitosamente.';
                }
                $_SESSION['flash_type'] = 'success';
                header("Location: " . $siteUrl . "/admin/categories.php");
                exit;
            } catch (Exception $e) {
                $error = 'Error en base de datos: ' . $e->getMessage();
            }
        }
    }
}

$categories = $pdo->query("
    SELECT c.*, COUNT(p.id) AS post_count
    FROM categories c
    LEFT JOIN posts p ON c.id = p.category_id
    GROUP BY c.id
    ORDER BY c.sort_order ASC, c.name ASC
")->fetchAll();
?>

<div class="admin-categories-wrapper">
    <div class="grid-2col-unequal">
        <!-- Form Column (Left) -->
        <div class="admin-card-box">
            <h2 class="admin-card-title"><?= $editingCategory ? 'Editar Categoría' : 'Nueva Categoría' ?></h2>
            
            <?php if (!empty($error)): ?>
                <div class="admin-alert error"><?= e($error) ?></div>
            <?php endif; ?>

            <form action="" method="POST">
                <input type="hidden" name="csrf_token" value="<?= e(generate_csrf_token()) ?>">
                <?php if ($editingCategory): ?>
                    <input type="hidden" name="edit_id" value="<?= $editingCategory['id'] ?>">
                <?php endif; ?>

                <div class="form-group">
                    <label for="catName" class="form-label">Nombre de la Categoría <span class="required">*</span></label>
                    <input type="text" id="catName" name="name" value="<?= e($editingCategory['name'] ?? '') ?>" class="form-control" placeholder="Ej: Economía, Innovación" required>
                </div>

                <div class="form-group">
                    <label for="catSlug" class="form-label">Slug de la URL</label>
                    <input type="text" id="catSlug" name="slug" value="<?= e($editingCategory['slug'] ?? '') ?>" class="form-control" placeholder="economia">
                </div>

                <div class="form-group">
                    <label for="catDesc" class="form-label">Descripción</label>
                    <textarea id="catDesc" name="description" rows="3" class="form-control" placeholder="Descripción temática de la sección..."><?= e($editingCategory['description'] ?? '') ?></textarea>
                </div>

                <div class="form-group">
                    <label for="catColor" class="form-label">Color Distintivo</label>
                    <div class="color-picker-wrap">
                        <input type="color" id="catColor" name="color" value="<?= e($editingCategory['color'] ?? '#2563eb') ?>" class="color-input">
                        <span class="color-hint">Se utilizará en las etiquetas y bordes de la portada.</span>
                    </div>
                </div>

                <div class="form-group">
                    <label for="catSeoTitle" class="form-label">SEO Title</label>
                    <input type="text" id="catSeoTitle" name="seo_title" value="<?= e($editingCategory['seo_title'] ?? '') ?>" class="form-control" placeholder="Título para buscadores">
                </div>

                <div class="form-group">
                    <label for="catMetaDesc" class="form-label">Meta Description</label>
                    <textarea id="catMetaDesc" name="meta_description" rows="2" class="form-control" placeholder="Descripción breve para Google..."><?= e($editingCategory['meta_description'] ?? '') ?></textarea>
                </div>

                <div class="form-group">
                    <label for="catStatus" class="form-label">Estado</label>
                    <select id="catStatus" name="status" class="form-control">
                        <option value="active" <?= ($editingCategory['status'] ?? '') === 'active' ? 'selected' : '' ?>>Activa (Visible en menú)</option>
                        <option value="inactive" <?= ($editingCategory['status'] ?? '') === 'inactive' ? 'selected' : '' ?>>Inactiva</option>
                    </select>
                </div>

                <div class="form-actions-row">
                    <button type="submit" class="btn-primary"><?= $editingCategory ? 'Guardar Cambios' : 'Crear Categoría' ?></button>
                    <?php if ($editingCategory): ?>
                        <a href="<?= e($siteUrl) ?>/admin/categories.php" class="btn-outline">Cancelar Edición</a>
                    <?php endif; ?>
                </div>
            </form>
        </div>

        <!-- List Column (Right) -->
        <div class="admin-card-box">
            <h2 class="admin-card-title">Categorías Existentes</h2>
            
            <div class="table-responsive">
                <table class="admin-data-table">
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th>Slug</th>
                            <th>Artículos</th>
                            <th>Estado</th>
                            <th style="text-align: right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($categories as $cat): ?>
                            <tr>
                                <td>
                                    <div class="cat-name-cell">
                                        <span class="cat-color-dot" style="background-color: <?= e($cat['color'] ?: '#2563eb') ?>"></span>
                                        <strong><?= e($cat['name']) ?></strong>
                                    </div>
                                </td>
                                <td><code>/<?= e($cat['slug']) ?>/</code></td>
                                <td><span class="badge-count"><?= $cat['post_count'] ?></span></td>
                                <td>
                                    <span class="status-badge <?= $cat['status'] === 'active' ? 'published' : 'draft' ?>">
                                        <?= $cat['status'] === 'active' ? 'Activa' : 'Inactiva' ?>
                                    </span>
                                </td>
                                <td style="text-align: right">
                                    <div class="table-actions-group" style="justify-content: flex-end;">
                                        <a href="<?= e($siteUrl) ?>/admin/categories.php?edit=<?= $cat['id'] ?>" class="action-btn edit" title="Editar">✏️</a>
                                        <a href="<?= e($siteUrl) ?>/<?= e($cat['slug']) ?>/" target="_blank" class="action-btn view" title="Ver en portal">👁️</a>
                                        <a href="<?= e($siteUrl) ?>/admin/categories.php?action=delete&id=<?= $cat['id'] ?>&token=<?= e(generate_csrf_token()) ?>" 
                                           class="action-btn delete" 
                                           onclick="return confirm('¿Eliminar esta categoría? Todos los artículos asociados serán afectados.');" 
                                           title="Eliminar">🗑️</a>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin-footer.php'; ?>
