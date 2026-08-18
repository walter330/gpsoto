<?php
/**
 * Site Settings Admin
 */

declare(strict_types=1);

$adminTitle = 'Configuración General del Portal';
require_once __DIR__ . '/includes/admin-header.php';

$pdo = DB::getConnection();
$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf_token'] ?? '';
    if (!verify_csrf_token($token)) {
        $error = 'Error de seguridad CSRF.';
    } else {
        $settingsToSave = [
            'site_name'           => trim($_POST['site_name'] ?? 'PULSO EDITORIAL'),
            'site_tagline'        => trim($_POST['site_tagline'] ?? ''),
            'site_description'    => trim($_POST['site_description'] ?? ''),
            'posts_per_page'      => (string)max(3, (int)($_POST['posts_per_page'] ?? 9)),
            'twitter_handle'      => trim($_POST['twitter_handle'] ?? ''),
            'facebook_url'        => trim($_POST['facebook_url'] ?? ''),
            'linkedin_url'        => trim($_POST['linkedin_url'] ?? ''),
            'footer_about'        => trim($_POST['footer_about'] ?? ''),
            'google_analytics_id' => trim($_POST['google_analytics_id'] ?? '')
        ];

        try {
            $stmt = $pdo->prepare("
                INSERT INTO settings (setting_key, setting_value)
                VALUES (:k, :v)
                ON DUPLICATE KEY UPDATE setting_value = :v2
            ");
            foreach ($settingsToSave as $k => $v) {
                $stmt->execute(['k' => $k, 'v' => $v, 'v2' => $v]);
            }
            $_SESSION['flash_message'] = 'Configuración guardada correctamente.';
            $_SESSION['flash_type'] = 'success';
            header("Location: " . $siteUrl . "/admin/settings.php");
            exit;
        } catch (Exception $e) {
            $error = 'Error al guardar: ' . $e->getMessage();
        }
    }
}

$settings = get_settings();
?>

<div class="admin-settings-wrapper">
    <?php if ($error): ?>
        <div class="admin-alert error"><?= e($error) ?></div>
    <?php endif; ?>

    <form action="" method="POST">
        <input type="hidden" name="csrf_token" value="<?= e(generate_csrf_token()) ?>">

        <div class="admin-card-box mb-6">
            <h2 class="admin-card-title">Identidad del Portal</h2>
            
            <div class="grid-2col">
                <div class="form-group">
                    <label for="siteName" class="form-label">Nombre del Sitio / Medio <span class="required">*</span></label>
                    <input type="text" id="siteName" name="site_name" value="<?= e($settings['site_name'] ?? 'PULSO EDITORIAL') ?>" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="siteTagline" class="form-label">Eslogan / Bajada Institucional</label>
                    <input type="text" id="siteTagline" name="site_tagline" value="<?= e($settings['site_tagline'] ?? '') ?>" class="form-control">
                </div>
            </div>

            <div class="form-group">
                <label for="siteDesc" class="form-label">Descripción General (Para buscadores)</label>
                <textarea id="siteDesc" name="site_description" rows="2" class="form-control"><?= e($settings['site_description'] ?? '') ?></textarea>
            </div>

            <div class="form-group">
                <label for="postsPerPage" class="form-label">Artículos por página en categorías</label>
                <input type="number" id="postsPerPage" name="posts_per_page" value="<?= e($settings['posts_per_page'] ?? '9') ?>" min="3" max="30" class="form-control" style="max-width: 160px;">
            </div>
        </div>

        <div class="admin-card-box mb-6">
            <h2 class="admin-card-title">Redes Sociales & Pie de Página</h2>

            <div class="grid-3col">
                <div class="form-group">
                    <label for="twHandle" class="form-label">Usuario Twitter/X</label>
                    <input type="text" id="twHandle" name="twitter_handle" value="<?= e($settings['twitter_handle'] ?? '') ?>" class="form-control" placeholder="@pulsoeditorial">
                </div>
                <div class="form-group">
                    <label for="fbUrl" class="form-label">URL de Facebook</label>
                    <input type="url" id="fbUrl" name="facebook_url" value="<?= e($settings['facebook_url'] ?? '') ?>" class="form-control" placeholder="https://facebook.com/...">
                </div>
                <div class="form-group">
                    <label for="liUrl" class="form-label">URL de LinkedIn</label>
                    <input type="url" id="liUrl" name="linkedin_url" value="<?= e($settings['linkedin_url'] ?? '') ?>" class="form-control" placeholder="https://linkedin.com/company/...">
                </div>
            </div>

            <div class="form-group">
                <label for="footerAbout" class="form-label">Texto Resumen del Footer</label>
                <textarea id="footerAbout" name="footer_about" rows="3" class="form-control"><?= e($settings['footer_about'] ?? '') ?></textarea>
            </div>
        </div>

        <div class="admin-card-box mb-6">
            <h2 class="admin-card-title">Integraciones & Analítica</h2>
            <div class="form-group">
                <label for="gaId" class="form-label">Google Analytics 4 (Measurement ID / G-XXXXX)</label>
                <input type="text" id="gaId" name="google_analytics_id" value="<?= e($settings['google_analytics_id'] ?? '') ?>" class="form-control" placeholder="G-XXXXXXXXXX">
            </div>
        </div>

        <button type="submit" class="btn-primary">Guardar Toda la Configuración</button>
    </form>
</div>

<?php require_once __DIR__ . '/includes/admin-footer.php'; ?>
