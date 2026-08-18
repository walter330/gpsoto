<?php
/**
 * Admin Post Create / Edit Form
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/functions.php';

$pdo = DB::getConnection();
$siteUrl = rtrim(SITE_URL, '/');

$postId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$isEditing = $postId > 0;
$adminTitle = $isEditing ? 'Editar Noticia' : 'Redactar Nueva Noticia';

$errors = [];
$post = [
    'title'            => '',
    'slug'             => '',
    'category_id'      => 1,
    'author_id'        => 1,
    'excerpt'          => '',
    'content'          => '',
    'image'            => '',
    'image_alt'        => '',
    'is_hero'          => 0,
    'is_featured'      => 0,
    'status'           => 'published',
    'published_at'     => date('Y-m-d\TH:i'),
    'seo_title'        => '',
    'meta_description' => '',
    'canonical_url'    => '',
    'robots'           => 'index, follow'
];

if ($isEditing) {
    $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => $postId]);
    $existing = $stmt->fetch();
    if ($existing) {
        $post = $existing;
        $post['published_at'] = date('Y-m-d\TH:i', strtotime($existing['published_at']));
    } else {
        header("Location: " . $siteUrl . "/admin/posts.php");
        exit;
    }
}

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf_token'] ?? '';
    if (!verify_csrf_token($token)) {
        $errors[] = 'Token de seguridad inválido. Recarga la página.';
    } else {
        $title = trim($_POST['title'] ?? '');
        $slug = trim($_POST['slug'] ?? '');
        if (empty($slug) && !empty($title)) {
            $slug = slugify($title);
        } else {
            $slug = slugify($slug);
        }

        $categoryId = (int)($_POST['category_id'] ?? 1);
        $authorId = (int)($_POST['author_id'] ?? 1);
        $excerpt = trim($_POST['excerpt'] ?? '');
        $content = $_POST['content'] ?? '';
        $image = trim($_POST['image'] ?? '');
        $imageAlt = trim($_POST['image_alt'] ?? '');
        $isHero = isset($_POST['is_hero']) ? 1 : 0;
        $isFeatured = isset($_POST['is_featured']) ? 1 : 0;
        $status = $_POST['status'] === 'draft' ? 'draft' : 'published';
        $publishedAt = $_POST['published_at'] ? date('Y-m-d H:i:s', strtotime($_POST['published_at'])) : date('Y-m-d H:i:s');
        $seoTitle = trim($_POST['seo_title'] ?? '');
        $metaDesc = trim($_POST['meta_description'] ?? '');
        $canonical = trim($_POST['canonical_url'] ?? '');
        $robots = trim($_POST['robots'] ?? 'index, follow');

        if (empty($title)) {
            $errors[] = 'El título de la noticia es obligatorio.';
        }
        if (empty($content)) {
            $errors[] = 'El contenido del artículo no puede estar vacío.';
        }
        if (empty($image)) {
            $image = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1000&auto=format&fit=crop&q=80';
        }

        if (empty($errors)) {
            // If marked as hero, optionally unmark older heroes
            if ($isHero) {
                $pdo->exec("UPDATE posts SET is_hero = 0 WHERE is_hero = 1");
            }

            if ($isEditing) {
                $stmt = $pdo->prepare("
                    UPDATE posts SET
                        title = :title, slug = :slug, category_id = :cat_id, author_id = :author_id,
                        excerpt = :excerpt, content = :content, image = :image, image_alt = :image_alt,
                        is_hero = :is_hero, is_featured = :is_featured, status = :status,
                        published_at = :published_at, seo_title = :seo_title, meta_description = :meta_description,
                        canonical_url = :canonical_url, robots = :robots
                    WHERE id = :id
                ");
                $stmt->execute([
                    'title'            => $title,
                    'slug'             => $slug,
                    'cat_id'           => $categoryId,
                    'author_id'        => $authorId,
                    'excerpt'          => $excerpt,
                    'content'          => $content,
                    'image'            => $image,
                    'image_alt'        => $imageAlt,
                    'is_hero'          => $isHero,
                    'is_featured'      => $isFeatured,
                    'status'           => $status,
                    'published_at'     => $publishedAt,
                    'seo_title'        => $seoTitle,
                    'meta_description' => $metaDesc,
                    'canonical_url'    => $canonical ?: null,
                    'robots'           => $robots,
                    'id'               => $postId
                ]);
                $_SESSION['flash_message'] = 'Noticia actualizada con éxito.';
            } else {
                $stmt = $pdo->prepare("
                    INSERT INTO posts (
                        title, slug, category_id, author_id, excerpt, content, image, image_alt,
                        is_hero, is_featured, status, published_at, seo_title, meta_description,
                        canonical_url, robots
                    ) VALUES (
                        :title, :slug, :cat_id, :author_id, :excerpt, :content, :image, :image_alt,
                        :is_hero, :is_featured, :status, :published_at, :seo_title, :meta_description,
                        :canonical_url, :robots
                    )
                ");
                $stmt->execute([
                    'title'            => $title,
                    'slug'             => $slug,
                    'cat_id'           => $categoryId,
                    'author_id'        => $authorId,
                    'excerpt'          => $excerpt,
                    'content'          => $content,
                    'image'            => $image,
                    'image_alt'        => $imageAlt,
                    'is_hero'          => $isHero,
                    'is_featured'      => $isFeatured,
                    'status'           => $status,
                    'published_at'     => $publishedAt,
                    'seo_title'        => $seoTitle,
                    'meta_description' => $metaDesc,
                    'canonical_url'    => $canonical ?: null,
                    'robots'           => $robots
                ]);
                $postId = (int)$pdo->lastInsertId();
                $_SESSION['flash_message'] = 'Noticia creada y publicada con éxito.';
            }

            $_SESSION['flash_type'] = 'success';
            header("Location: " . $siteUrl . "/admin/posts.php");
            exit;
        }
    }
}

$categories = get_categories();
$authors = $pdo->query("SELECT * FROM authors ORDER BY name ASC")->fetchAll();

require_once __DIR__ . '/includes/admin-header.php';
?>

<div class="post-editor-wrapper">
    <?php if (!empty($errors)): ?>
        <div class="admin-alert error">
            <ul>
                <?php foreach ($errors as $err): ?>
                    <li><?= e($err) ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <form action="" method="POST" class="editor-main-form" id="postForm">
        <input type="hidden" name="csrf_token" value="<?= e(generate_csrf_token()) ?>">

        <div class="editor-layout-grid">
            <!-- Left Column: Title, Excerpt, Content Editor, SEO Fields -->
            <div class="editor-primary-col">
                <div class="admin-card-box">
                    <div class="form-group">
                        <label for="postTitle" class="form-label">Título de la Noticia (H1) <span class="required">*</span></label>
                        <input type="text" id="postTitle" name="title" value="<?= e($post['title']) ?>" class="form-control title-input" placeholder="Escribe un titular periodístico claro y atractivo..." required>
                    </div>

                    <div class="form-group">
                        <label for="postSlug" class="form-label">Slug de la URL (amigable)</label>
                        <div class="slug-input-wrap">
                            <span class="slug-prefix"><?= e($siteUrl) ?>/categoria/</span>
                            <input type="text" id="postSlug" name="slug" value="<?= e($post['slug']) ?>" class="form-control" placeholder="slug-automatico">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="postExcerpt" class="form-label">Extracto / Bajada (Resumen breve de la noticia)</label>
                        <textarea id="postExcerpt" name="excerpt" rows="3" class="form-control" placeholder="Breve descripción de 1 a 2 oraciones para la portada y tarjetas de noticias..."><?= e($post['excerpt']) ?></textarea>
                    </div>

                    <!-- Visual Editor Toolbar -->
                    <div class="form-group">
                        <label class="form-label">Cuerpo del Artículo <span class="required">*</span></label>
                        
                        <div class="custom-editor-toolbar" id="editorToolbar">
                            <button type="button" class="toolbar-btn" data-cmd="formatBlock" data-val="h2" title="Subtítulo H2">H2</button>
                            <button type="button" class="toolbar-btn" data-cmd="formatBlock" data-val="h3" title="Subtítulo H3">H3</button>
                            <button type="button" class="toolbar-btn" data-cmd="formatBlock" data-val="p" title="Párrafo">P</button>
                            <span class="toolbar-separator"></span>
                            <button type="button" class="toolbar-btn" data-cmd="bold" title="Negrita"><b>B</b></button>
                            <button type="button" class="toolbar-btn" data-cmd="italic" title="Cursiva"><i>I</i></button>
                            <span class="toolbar-separator"></span>
                            <button type="button" class="toolbar-btn" data-cmd="insertUnorderedList" title="Lista de viñetas">&bull; Lista</button>
                            <button type="button" class="toolbar-btn" data-cmd="insertOrderedList" title="Lista numerada">1. Lista</button>
                            <button type="button" class="toolbar-btn" data-cmd="formatBlock" data-val="blockquote" title="Cita editorial">❝ Cita</button>
                            <span class="toolbar-separator"></span>
                            <button type="button" class="toolbar-btn" id="insertLinkBtn" title="Insertar Enlace">🔗 Link</button>
                            <button type="button" class="toolbar-btn" id="insertImageBtn" title="Insertar Imagen en cuerpo">🖼️ Imagen</button>
                            <button type="button" class="toolbar-btn mode-toggle" id="toggleHtmlModeBtn" title="Ver código HTML">HTML &lt;/&gt;</button>
                        </div>

                        <!-- Visual Contenteditable Area -->
                        <div id="visualEditor" class="visual-content-area typography-prose" contenteditable="true">
                            <?= $post['content'] ?: '<p>Escribe aquí el contenido de la noticia...</p>' ?>
                        </div>

                        <!-- Raw Textarea for Form Submission & HTML Mode -->
                        <textarea name="content" id="rawContentTextarea" style="display:none;"><?= e($post['content']) ?></textarea>
                    </div>
                </div>

                <!-- SEO METADATA CARD (Schema & Search Engine Previews) -->
                <div class="admin-card-box seo-settings-card">
                    <div class="seo-card-header">
                        <h3>Configuración SEO & Metadatos</h3>
                        <span class="seo-badge-tag">Optimización para Google</span>
                    </div>

                    <div class="form-group">
                        <label for="seoTitle" class="form-label">SEO Title (Título en Google)</label>
                        <input type="text" id="seoTitle" name="seo_title" value="<?= e($post['seo_title']) ?>" class="form-control" placeholder="Dejar en blanco para usar el título de la noticia">
                        <small class="form-hint">Recomendado: entre 50 y 60 caracteres.</small>
                    </div>

                    <div class="form-group">
                        <label for="metaDescription" class="form-label">Meta Description</label>
                        <textarea id="metaDescription" name="meta_description" rows="2" class="form-control" placeholder="Resumen persuasivo para los resultados de búsqueda..."><?= e($post['meta_description']) ?></textarea>
                        <small class="form-hint">Recomendado: entre 120 y 160 caracteres.</small>
                    </div>

                    <div class="grid-2col">
                        <div class="form-group">
                            <label for="canonicalUrl" class="form-label">Canonical URL (Opcional)</label>
                            <input type="url" id="canonicalUrl" name="canonical_url" value="<?= e($post['canonical_url']) ?>" class="form-control" placeholder="https://tudominio.com/...">
                        </div>

                        <div class="form-group">
                            <label for="robotsMeta" class="form-label">Meta Robots</label>
                            <select id="robotsMeta" name="robots" class="form-control">
                                <option value="index, follow" <?= $post['robots'] === 'index, follow' ? 'selected' : '' ?>>index, follow (Predeterminado - Indexar)</option>
                                <option value="noindex, follow" <?= $post['robots'] === 'noindex, follow' ? 'selected' : '' ?>>noindex, follow (No indexar)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Publishing Controls, Category, Author, Featured Image -->
            <div class="editor-sidebar-col">
                
                <!-- Publishing Actions Box -->
                <div class="admin-card-box">
                    <h3 class="sidebar-box-title">Publicación</h3>
                    
                    <div class="form-group">
                        <label for="postStatus" class="form-label">Estado</label>
                        <select id="postStatus" name="status" class="form-control">
                            <option value="published" <?= $post['status'] === 'published' ? 'selected' : '' ?>>Publicado (Visible)</option>
                            <option value="draft" <?= $post['status'] === 'draft' ? 'selected' : '' ?>>Borrador (Privado)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="publishedAt" class="form-label">Fecha y Hora de Publicación</label>
                        <input type="datetime-local" id="publishedAt" name="published_at" value="<?= e($post['published_at']) ?>" class="form-control">
                    </div>

                    <div class="form-group-checkboxes">
                        <label class="checkbox-label">
                            <input type="checkbox" name="is_hero" value="1" <?= $post['is_hero'] ? 'checked' : '' ?>>
                            <span class="custom-check"></span>
                            <span><strong>Noticia Principal</strong> (Hero de Portada)</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="is_featured" value="1" <?= $post['is_featured'] ? 'checked' : '' ?>>
                            <span class="custom-check"></span>
                            <span><strong>Destacar en Home</strong> (Carrusel horizontal)</span>
                        </label>
                    </div>

                    <div class="sidebar-actions-btn-group">
                        <button type="submit" class="btn-primary w-full"><?= $isEditing ? 'Guardar Cambios' : 'Publicar Noticia' ?></button>
                        <a href="<?= e($siteUrl) ?>/admin/posts.php" class="btn-outline w-full">Cancelar</a>
                    </div>
                </div>

                <!-- Category Selector -->
                <div class="admin-card-box">
                    <h3 class="sidebar-box-title">Categoría</h3>
                    <div class="form-group">
                        <select name="category_id" class="form-control" required>
                            <?php foreach ($categories as $cat): ?>
                                <option value="<?= $cat['id'] ?>" <?= (int)$post['category_id'] === (int)$cat['id'] ? 'selected' : '' ?>>
                                    <?= e($cat['name']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <!-- Author Selector -->
                <div class="admin-card-box">
                    <h3 class="sidebar-box-title">Autor / Redactor</h3>
                    <div class="form-group">
                        <select name="author_id" class="form-control" required>
                            <?php foreach ($authors as $auth): ?>
                                <option value="<?= $auth['id'] ?>" <?= (int)$post['author_id'] === (int)$auth['id'] ? 'selected' : '' ?>>
                                    <?= e($auth['name']) ?> (<?= e($auth['role_title'] ?? 'Autor') ?>)
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <!-- Featured Image Box -->
                <div class="admin-card-box">
                    <h3 class="sidebar-box-title">Imagen Destacada</h3>
                    
                    <div class="form-group">
                        <label for="postImage" class="form-label">URL de la Imagen</label>
                        <input type="url" id="postImage" name="image" value="<?= e($post['image']) ?>" class="form-control" placeholder="https://ejemplo.com/imagen.jpg" required>
                    </div>

                    <div class="form-group">
                        <label for="postImageAlt" class="form-label">Texto Alternativo (ALT para SEO)</label>
                        <input type="text" id="postImageAlt" name="image_alt" value="<?= e($post['image_alt']) ?>" class="form-control" placeholder="Descripción de la imagen para accesibilidad y Google">
                    </div>

                    <div class="image-preview-wrapper" id="imagePreviewBox">
                        <?php if (!empty($post['image'])): ?>
                            <img src="<?= e($post['image']) ?>" alt="Vista previa" class="image-preview-thumb">
                        <?php else: ?>
                            <div class="image-preview-placeholder">Sin imagen asignada</div>
                        <?php endif; ?>
                    </div>
                </div>

            </div>
        </div>
    </form>
</div>

<script>
// Sync visual editor with textarea on form submission
document.getElementById('postForm').addEventListener('submit', function() {
    const visual = document.getElementById('visualEditor');
    const textarea = document.getElementById('rawContentTextarea');
    textarea.value = visual.innerHTML;
});

// Auto-generate slug from title if empty
document.getElementById('postTitle').addEventListener('blur', function() {
    const slugInput = document.getElementById('postSlug');
    if (!slugInput.value) {
        slugInput.value = this.value
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
});

// Live image preview
document.getElementById('postImage').addEventListener('input', function() {
    const previewBox = document.getElementById('imagePreviewBox');
    if (this.value) {
        previewBox.innerHTML = '<img src="' + this.value + '" class="image-preview-thumb" onerror="this.src=\'\'">';
    } else {
        previewBox.innerHTML = '<div class="image-preview-placeholder">Sin imagen</div>';
    }
});

// Custom toolbar actions
document.querySelectorAll('.toolbar-btn[data-cmd]').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const cmd = this.dataset.cmd;
        const val = this.dataset.val || null;
        document.execCommand(cmd, false, val);
        document.getElementById('visualEditor').focus();
    });
});

document.getElementById('insertLinkBtn').addEventListener('click', function() {
    const url = prompt('Introduce la URL del enlace:');
    if (url) {
        document.execCommand('createLink', false, url);
    }
});

document.getElementById('insertImageBtn').addEventListener('click', function() {
    const url = prompt('Introduce la URL de la imagen:');
    if (url) {
        document.execCommand('insertImage', false, url);
    }
});

let isHtmlMode = false;
document.getElementById('toggleHtmlModeBtn').addEventListener('click', function() {
    const visual = document.getElementById('visualEditor');
    const textarea = document.getElementById('rawContentTextarea');
    isHtmlMode = !isHtmlMode;
    if (isHtmlMode) {
        textarea.value = visual.innerHTML;
        visual.style.display = 'none';
        textarea.style.display = 'block';
        textarea.style.height = '350px';
        this.classList.add('active');
    } else {
        visual.innerHTML = textarea.value;
        textarea.style.display = 'none';
        visual.style.display = 'block';
        this.classList.remove('active');
    }
});
</script>

<?php require_once __DIR__ . '/includes/admin-footer.php'; ?>
