<?php
/**
 * Database Singleton Connection Class using PDO
 * Secure, prepared-statements ready, UTF-8 mb4
 */

declare(strict_types=1);

require_once __DIR__ . '/../config.php';

class DB {
    private static ?PDO $instance = null;

    private function __construct() {}
    private function __clone() {}

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            
            try {
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                if (APP_ENV === 'development') {
                    die("Database connection failed: " . $e->getMessage());
                } else {
                    die("Error al conectar con la base de datos. Por favor revisa la configuración en config.php.");
                }
            }
        }
        return self::$instance;
    }
}
