<?php
/**
 * Admin Login
 * Protected with password_verify, CSRF Token, and Session Security
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/functions.php';

$siteUrl = rtrim(SITE_URL, '/');
$siteName = get_setting('site_name', 'PULSO EDITORIAL');
$error = '';

if (is_admin_logged_in()) {
    header("Location: " . $siteUrl . "/admin/");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf_token'] ?? '';
    if (!verify_csrf_token($token)) {
        $error = 'Error de seguridad (CSRF inválido). Recarga la página.';
    } else {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($username) || empty($password)) {
            $error = 'Por favor ingresa tu usuario y contraseña.';
        } else {
            try {
                $pdo = DB::getConnection();
                $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :u OR email = :e LIMIT 1");
                $stmt->execute(['u' => $username, 'e' => $username]);
                $user = $stmt->fetch();

                if ($user && password_verify($password, $user['password'])) {
                    session_regenerate_id(true);
                    $_SESSION['admin_user_id'] = $user['id'];
                    $_SESSION['admin_user_name'] = $user['name'];
                    $_SESSION['admin_user_role'] = $user['role'];

                    header("Location: " . $siteUrl . "/admin/");
                    exit;
                } else {
                    $error = 'Credenciales incorrectas. Verifica el usuario y la contraseña.';
                }
            } catch (Exception $e) {
                $error = 'Error de base de datos: ' . $e->getMessage();
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso al CMS | <?= e($siteName) ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= e($siteUrl) ?>/assets/css/style.css">
</head>
<body class="login-body">
    <div class="login-card-box">
        <div class="login-header">
            <div class="login-icon">⚡</div>
            <h1 class="login-title"><?= e($siteName) ?></h1>
            <p class="login-subtitle">Panel de Control Editorial y Redacción</p>
        </div>

        <?php if (!empty($error)): ?>
            <div class="login-alert-error">
                <?= e($error) ?>
            </div>
        <?php endif; ?>

        <form action="" method="POST" class="login-form">
            <input type="hidden" name="csrf_token" value="<?= e(generate_csrf_token()) ?>">
            
            <div class="form-group">
                <label for="username">Usuario o Correo Electrónico</label>
                <input type="text" id="username" name="username" placeholder="admin" required autofocus value="<?= e($_POST['username'] ?? '') ?>">
            </div>

            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" id="password" name="password" placeholder="••••••••" required>
            </div>

            <button type="submit" class="btn-primary w-full login-submit-btn">Ingresar al Panel</button>
        </form>

        <div class="login-demo-notice">
            <span>Credenciales por defecto:</span>
            <code>Usuario: <strong>admin</strong> | Clave: <strong>admin123</strong></code>
        </div>

        <div class="login-back-link">
            <a href="<?= e($siteUrl) ?>/">&larr; Volver al Portal de Noticias</a>
        </div>
    </div>
</body>
</html>
