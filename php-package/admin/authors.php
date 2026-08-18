<?php
/**
 * Authors Management Admin
 */

declare(strict_types=1);

$adminTitle = 'Gestión de Autores y Redactores';
require_once __DIR__ . '/includes/admin-header.php';

$pdo = DB::getConnection();
$error = '';
$editingAuthor = null;

// Handle Delete
if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $token = $_GET['token'] ?? '';
    if (verify_csrf_token($token)) {
        $count = (int)$pdo->query("SELECT COUNT(*) FROM authors")->fetchColumn();
        if ($count > 1) {
            $stmt = $pdo->prepare("DELETE FROM authors WHERE id = :id");
            $stmt->execute(['id' => $id]);
            $_SESSION['flash_message'] = 'Autor eliminado.';
            $_SESSION['flash_type'] = 'success';
        } else {
            $_SESSION['flash_message'] = 'Debe existir al menos un autor.';
            $_SESSION['flash_type'] = 'error';
        }
        header("Location: " . $siteUrl . "/admin/authors.php");
        exit;
    }
}

// Handle Edit Mode
if (isset($_GET['edit'])) {
    $id = (int)$_GET['edit'];
    $stmt = $pdo->prepare("SELECT * FROM authors WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => $id]);
    $editingAuthor = $stmt->fetch();
}

// Handle Save
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf_token'] ?? '';
    if (!verify_csrf_token($token)) {
        $error = 'Error de seguridad CSRF.';
    } else {
        $name = trim($_POST['name'] ?? '');
        $slug = slugify(trim($_POST['slug'] ?? $name));
        $role = trim($_POST['role_title'] ?? 'Redactor Editorial');
        $avatar = trim($_POST['avatar'] ?? '');
        $bio = trim($_POST['bio'] ?? '');
        $twitter = trim($_POST['twitter'] ?? '');
        $linkedin = trim($_POST['linkedin'] ?? '');
        $editId = isset($_POST['edit_id']) ? (int)$_POST['edit_id'] : 0;

        if (empty($name)) {
            $error = 'El nombre del autor es obligatorio.';
        } else {
            if (empty($avatar)) {
                $avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
            }

            if ($editId > 0) {
                $stmt = $pdo->prepare("
                    UPDATE authors SET
                        name = :name, slug = :slug, role_title = :role_title,
                        avatar = :avatar, bio = :bio, twitter = :twitter, linkedin = :linkedin
                    WHERE id = :id
                ");
                $stmt->execute([
                    'name'       => $name,
                    'slug'       => $slug,
                    'role_title' => $role,
                    'avatar'     => $avatar,
                    'bio'        => $bio,
                    'twitter'    => $twitter,
                    'linkedin'   => $linkedin,
                    'id'         => $editId
                ]);
                $_SESSION['flash_message'] = 'Autor actualizado con éxito.';
            } else {
                $stmt = $pdo->prepare("
                    INSERT INTO authors (name, slug, role_title, avatar, bio, twitter, linkedin)
                    VALUES (:name, :slug, :role_title, :avatar, :bio, :twitter, :linkedin)
                ");
                $stmt->execute([
                    'name'       => $name,
                    'slug'       => $slug,
                    'role_title' => $role,
                    'avatar'     => $avatar,
                    'bio'        => $bio,
                    'twitter'    => $twitter,
                    'linkedin'   => $linkedin
                ]);
                $_SESSION['flash_message'] = 'Autor creado con éxito.';
            }
            $_SESSION['flash_type'] = 'success';
            header("Location: " . $siteUrl . "/admin/authors.php");
            exit;
        }
    }
}

$authors = $pdo->query("
    SELECT a.*, COUNT(p.id) AS post_count
    FROM authors a
    LEFT JOIN posts p ON a.id = p.author_id
    GROUP BY a.id
    ORDER BY a.name ASC
")->fetchAll();
?>

<div class="admin-authors-wrapper">
    <div class="grid-2col-unequal">
        <!-- Form Column -->
        <div class="admin-card-box">
            <h2 class="admin-card-title"><?= $editingAuthor ? 'Editar Autor' : 'Nuevo Autor / Redactor' ?></h2>

            <?php if (!empty($error)): ?>
                <div class="admin-alert error"><?= e($error) ?></div>
            <?php endif; ?>

            <form action="" method="POST">
                <input type="hidden" name="csrf_token" value="<?= e(generate_csrf_token()) ?>">
                <?php if ($editingAuthor): ?>
                    <input type="hidden" name="edit_id" value="<?= $editingAuthor['id'] ?>">
                <?php endif; ?>

                <div class="form-group">
                    <label for="authorName" class="form-label">Nombre Completo <span class="required">*</span></label>
                    <input type="text" id="authorName" name="name" value="<?= e($editingAuthor['name'] ?? '') ?>" class="form-control" placeholder="Ej: Dra. Elena Rostova" required>
                </div>

                <div class="form-group">
                    <label for="authorSlug" class="form-label">Slug de Perfil</label>
                    <input type="text" id="authorSlug" name="slug" value="<?= e($editingAuthor['slug'] ?? '') ?>" class="form-control" placeholder="elena-rostova">
                </div>

                <div class="form-group">
                    <label for="authorRole" class="form-label">Cargo / Especialidad</label>
                    <input type="text" id="authorRole" name="role_title" value="<?= e($editingAuthor['role_title'] ?? '') ?>" class="form-control" placeholder="Ej: Analista Económico Senior">
                </div>

                <div class="form-group">
                    <label for="authorAvatar" class="form-label">URL de Fotografía / Avatar</label>
                    <input type="url" id="authorAvatar" name="avatar" value="<?= e($editingAuthor['avatar'] ?? '') ?>" class="form-control" placeholder="https://...">
                </div>

                <div class="form-group">
                    <label for="authorBio" class="form-label">Biografía Profesional</label>
                    <textarea id="authorBio" name="bio" rows="3" class="form-control" placeholder="Resumen de trayectoria y especialidad..."><?= e($editingAuthor['bio'] ?? '') ?></textarea>
                </div>

                <div class="grid-2col">
                    <div class="form-group">
                        <label for="authorTwitter" class="form-label">Usuario Twitter/X</label>
                        <input type="text" id="authorTwitter" name="twitter" value="<?= e($editingAuthor['twitter'] ?? '') ?>" class="form-control" placeholder="elenarostova">
                    </div>

                    <div class="form-group">
                        <label for="authorLinkedin" class="form-label">URL de LinkedIn</label>
                        <input type="url" id="authorLinkedin" name="linkedin" value="<?= e($editingAuthor['linkedin'] ?? '') ?>" class="form-control" placeholder="https://linkedin.com/in/...">
                    </div>
                </div>

                <div class="form-actions-row">
                    <button type="submit" class="btn-primary"><?= $editingAuthor ? 'Guardar Cambios' : 'Crear Autor' ?></button>
                    <?php if ($editingAuthor): ?>
                        <a href="<?= e($siteUrl) ?>/admin/authors.php" class="btn-outline">Cancelar</a>
                    <?php endif; ?>
                </div>
            </form>
        </div>

        <!-- List Column -->
        <div class="admin-card-box">
            <h2 class="admin-card-title">Equipo Editorial</h2>
            
            <div class="authors-admin-grid">
                <?php foreach ($authors as $a): ?>
                    <div class="author-admin-card">
                        <img src="<?= e($a['avatar']) ?>" alt="" class="author-admin-avatar" width="60" height="60">
                        <div class="author-admin-info">
                            <h3 class="author-admin-name"><?= e($a['name']) ?></h3>
                            <p class="author-admin-role"><?= e($a['role_title'] ?? 'Redactor') ?></p>
                            <span class="author-admin-count"><?= $a['post_count'] ?> artículos publicados</span>
                        </div>
                        <div class="author-admin-actions">
                            <a href="<?= e($siteUrl) ?>/admin/authors.php?edit=<?= $a['id'] ?>" class="action-btn edit" title="Editar">✏️</a>
                            <a href="<?= e($siteUrl) ?>/autor/<?= e($a['slug']) ?>/" target="_blank" class="action-btn view" title="Ver perfil público">👁️</a>
                            <a href="<?= e($siteUrl) ?>/admin/authors.php?action=delete&id=<?= $a['id'] ?>&token=<?= e(generate_csrf_token()) ?>" 
                               class="action-btn delete" 
                               onclick="return confirm('¿Eliminar autor?');" 
                               title="Eliminar">🗑️</a>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin-footer.php'; ?>
