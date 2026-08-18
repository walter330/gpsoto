<?php
/**
 * Media & Images Management Admin
 */

declare(strict_types=1);

$adminTitle = 'Biblioteca de Medios e Imágenes';
require_once __DIR__ . '/includes/admin-header.php';

$pdo = DB::getConnection();
$message = '';
$error = '';

// Handle Image Upload Simulation / Store
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_media') {
    $token = $_POST['csrf_token'] ?? '';
    if (!verify_csrf_token($token)) {
        $error = 'Error de seguridad CSRF.';
    } else {
        $imageUrl = trim($_POST['image_url'] ?? '');
        $altText = trim($_POST['alt_text'] ?? '');
        $filename = basename($imageUrl) ?: ('imagen_' . time() . '.jpg');

        if (!empty($imageUrl)) {
            $stmt = $pdo->prepare("
                INSERT INTO media (filename, filepath, filetype, filesize, alt_text)
                VALUES (:fn, :fp, 'image/jpeg', 102400, :alt)
            ");
            $stmt->execute([
                'fn'  => $filename,
                'fp'  => $imageUrl,
                'alt' => $altText
            ]);
            $message = 'Imagen añadida a la biblioteca con éxito.';
        } else {
            $error = 'Por favor ingresa una URL de imagen válida.';
        }
    }
}

// Handle Delete Media
if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $token = $_GET['token'] ?? '';
    if (verify_csrf_token($token)) {
        $stmt = $pdo->prepare("DELETE FROM media WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $_SESSION['flash_message'] = 'Imagen eliminada.';
        $_SESSION['flash_type'] = 'success';
        header("Location: " . $siteUrl . "/admin/media.php");
        exit;
    }
}

// Fetch Media Items or Post Images
$mediaItems = $pdo->query("SELECT * FROM media ORDER BY id DESC")->fetchAll();

// If media table is empty, display images currently used in posts as library
$postImages = $pdo->query("SELECT DISTINCT image, title, image_alt FROM posts WHERE image IS NOT NULL AND image != '' LIMIT 12")->fetchAll();
?>

<div class="admin-media-wrapper">
    <?php if ($message): ?>
        <div class="admin-alert success"><?= e($message) ?></div>
    <?php endif; ?>
    <?php if ($error): ?>
        <div class="admin-alert error"><?= e($error) ?></div>
    <?php endif; ?>

    <!-- Add Image Box -->
    <div class="admin-card-box mb-6">
        <h2 class="admin-card-title">Añadir Nueva Imagen a la Biblioteca</h2>
        <form action="" method="POST" class="media-upload-form">
            <input type="hidden" name="action" value="add_media">
            <input type="hidden" name="csrf_token" value="<?= e(generate_csrf_token()) ?>">

            <div class="grid-2col">
                <div class="form-group">
                    <label for="imgUrl" class="form-label">URL de la Imagen <span class="required">*</span></label>
                    <input type="url" id="imgUrl" name="image_url" placeholder="https://images.unsplash.com/... o /uploads/..." class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="imgAlt" class="form-label">Texto Alternativo (ALT)</label>
                    <input type="text" id="imgAlt" name="alt_text" placeholder="Descripción de la imagen para SEO" class="form-control">
                </div>
            </div>

            <button type="submit" class="btn-primary">Guardar en Biblioteca</button>
        </form>
    </div>

    <!-- Media Gallery Grid -->
    <div class="admin-card-box">
        <h2 class="admin-card-title">Galería de Imágenes Disponibles</h2>
        
        <div class="media-gallery-grid">
            <?php foreach ($postImages as $img): ?>
                <div class="media-item-card">
                    <div class="media-thumb-wrap">
                        <img src="<?= e($img['image']) ?>" alt="<?= e($img['image_alt'] ?: $img['title']) ?>" loading="lazy">
                    </div>
                    <div class="media-item-details">
                        <p class="media-item-name" title="<?= e($img['title']) ?>"><?= e(mb_strimwidth($img['title'], 0, 30, '...')) ?></p>
                        <button class="btn-copy-url" onclick="navigator.clipboard.writeText('<?= e($img['image']) ?>'); alert('¡URL copiada al portapapeles!');">
                            Copiar URL
                        </button>
                    </div>
                </div>
            <?php endforeach; ?>

            <?php foreach ($mediaItems as $item): ?>
                <div class="media-item-card">
                    <div class="media-thumb-wrap">
                        <img src="<?= e($item['filepath']) ?>" alt="<?= e($item['alt_text']) ?>" loading="lazy">
                    </div>
                    <div class="media-item-details">
                        <p class="media-item-name"><?= e($item['filename']) ?></p>
                        <div class="media-actions-row">
                            <button class="btn-copy-url" onclick="navigator.clipboard.writeText('<?= e($item['filepath']) ?>'); alert('¡URL copiada!');">
                                Copiar URL
                            </button>
                            <a href="<?= e($siteUrl) ?>/admin/media.php?action=delete&id=<?= $item['id'] ?>&token=<?= e(generate_csrf_token()) ?>" 
                               class="action-btn delete" 
                               onclick="return confirm('¿Eliminar imagen?');">🗑️</a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/admin-footer.php'; ?>
