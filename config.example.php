<?php
/**
 * Configuración Principal del Portal Editorial y CMS
 * 
 * Copia este archivo como config.php y completa tus credenciales de MySQL y URL.
 */

declare(strict_types=1);

// Entorno: 'development' o 'production'
define('APP_ENV', 'production');

if (APP_ENV === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
} else {
    error_reporting(0);
    ini_set('display_errors', '0');
}

// Configuración de Base de Datos MySQL
define('DB_HOST', 'localhost');
define('DB_NAME', 'nombre_de_tu_basedatos');
define('DB_USER', 'usuario_mysql');
define('DB_PASS', 'tu_contrasena_segura');
define('DB_CHARSET', 'utf8mb4');

// URL Base del sitio web (sin barra final)
// Ejemplo: 'https://miportalnoticias.com' o 'http://localhost/mi-blog'
define('SITE_URL', 'https://tudominio.com');

// Zona Horaria
date_default_timezone_set('America/Lima'); // Ajustar a tu país: 'America/Mexico_City', 'America/Bogota', 'Europe/Madrid', etc.

// Configuración de Sesión Segura
ini_set('session.cookie_httponly', '1');
ini_set('session.use_only_cookies', '1');
ini_set('session.cookie_samesite', 'Lax');
if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
    ini_set('session.cookie_secure', '1');
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
