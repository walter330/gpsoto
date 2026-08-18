<?php
/**
 * Helper Functions, SEO Generators, CSRF Security, and Sanitization
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';

/**
 * Escapes HTML characters for safe output
 */
function e(?string $string): string {
    return htmlspecialchars($string ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

/**
 * Generates an SEO-friendly URL Slug
 */
function slugify(string $text): string {
    $text = transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $text);
    if ($text === false) {
        $text = strtolower(trim($text));
    }
    $text = preg_replace('~[^\\pL\d]+~u', '-', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    return empty($text) ? 'n-a' : $text;
}

/**
 * Generates CSRF Token and stores in session
 */
function generate_csrf_token(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verifies CSRF Token
 */
function verify_csrf_token(?string $token): bool {
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Formats dates in Spanish
 */
function format_date(string $dateString, bool $includeTime = false): string {
    $timestamp = strtotime($dateString);
    if (!$timestamp) return $dateString;

    $months = [
        1 => 'Enero', 2 => 'Febrero', 3 => 'Marzo', 4 => 'Abril',
        5 => 'Mayo', 6 => 'Junio', 7 => 'Julio', 8 => 'Agosto',
        9 => 'Septiembre', 10 => 'Octubre', 11 => 'Noviembre', 12 => 'Diciembre'
    ];

    $day = date('j', $timestamp);
    $monthNum = (int)date('n', $timestamp);
    $year = date('Y', $timestamp);
    $month = $months[$monthNum] ?? '';

    $formatted = "{$day} de {$month}, {$year}";
    if ($includeTime) {
        $formatted .= " a las " . date('H:i', $timestamp);
    }
    return $formatted;
}

/**
 * Calculates estimated reading time in minutes
 */
function estimate_reading_time(string $content): int {
    $wordCount = str_word_count(strip_tags($content));
    $wordsPerMinute = 200;
    return max(1, (int)ceil($wordCount / $wordsPerMinute));
}

/**
 * Gets site settings from database
 */
function get_settings(): array {
    static $settings = null;
    if ($settings !== null) return $settings;

    try {
        $pdo = DB::getConnection();
        $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
        $results = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        $settings = $results ?: [];
    } catch (Exception $e) {
        $settings = [];
    }
    return $settings;
}

/**
 * Gets a single setting value with fallback
 */
function get_setting(string $key, string $default = ''): string {
    $settings = get_settings();
    return $settings[$key] ?? $default;
}

/**
 * Fetches all active categories ordered
 */
function get_categories(): array {
    static $categories = null;
    if ($categories !== null) return $categories;

    try {
        $pdo = DB::getConnection();
        $stmt = $pdo->query("SELECT * FROM categories WHERE status = 'active' ORDER BY sort_order ASC, name ASC");
        $categories = $stmt->fetchAll();
    } catch (Exception $e) {
        $categories = [];
    }
    return $categories ?: [];
}

/**
 * Check if user is logged in to admin
 */
function is_admin_logged_in(): bool {
    return !empty($_SESSION['admin_user_id']);
}

/**
 * Requires admin authentication, redirects if not authenticated
 */
function require_admin_auth(): void {
    if (!is_admin_logged_in()) {
        header("Location: " . SITE_URL . "/admin/login.php");
        exit;
    }
}
