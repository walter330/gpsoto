<?php
/**
 * Admin Panel Header & Sidebar Navigation
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../includes/functions.php';

require_admin_auth();

$siteName = get_setting('site_name', 'PULSO EDITORIAL');
$siteUrl = rtrim(SITE_URL, '/');
$adminName = $_SESSION['admin_user_name'] ?? 'Administrador';
$currentPage = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($adminTitle ?? 'Panel de Administración') ?> | <?= e($siteName) ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= e($siteUrl) ?>/assets/css/style.css">
</head>
<body class="admin-body">

<div class="admin-wrapper">
    <!-- Admin Sidebar -->
    <aside class="admin-sidebar">
        <div class="admin-sidebar-header">
            <a href="<?= e($siteUrl) ?>/admin/" class="admin-brand">
                <span class="admin-brand-icon">⚡</span>
                <div class="admin-brand-text">
                    <span class="admin-brand-title"><?= e($siteName) ?></span>
                    <span class="admin-brand-badge">CMS EDITORIAL</span>
                </div>
            </a>
        </div>

        <nav class="admin-sidebar-nav">
            <div class="admin-nav-section-label">PRINCIPAL</div>
            <a href="<?= e($siteUrl) ?>/admin/" class="admin-nav-item <?= $currentPage === 'index.php' ? 'active' : '' ?>">
                <span class="nav-icon">📊</span>
                <span>Dashboard</span>
            </a>

            <div class="admin-nav-section-label">CONTENIDOS</div>
            <a href="<?= e($siteUrl) ?>/admin/posts.php" class="admin-nav-item <?= in_array($currentPage, ['posts.php', 'post-edit.php']) ? 'active' : '' ?>">
                <span class="nav-icon">📰</span>
                <span>Noticias y Artículos</span>
            </a>
            <a href="<?= e($siteUrl) ?>/admin/post-edit.php" class="admin-nav-item sub-item">
                <span class="nav-icon">➕</span>
                <span>Nueva Noticia</span>
            </a>
            <a href="<?= e($siteUrl) ?>/admin/categories.php" class="admin-nav-item <?= $currentPage === 'categories.php' ? 'active' : '' ?>">
                <span class="nav-icon">📁</span>
                <span>Categorías</span>
            </a>
            <a href="<?= e($siteUrl) ?>/admin/authors.php" class="admin-nav-item <?= $currentPage === 'authors.php' ? 'active' : '' ?>">
                <span class="nav-icon">✍️</span>
                <span>Autores</span>
            </a>
            <a href="<?= e($siteUrl) ?>/admin/media.php" class="admin-nav-item <?= $currentPage === 'media.php' ? 'active' : '' ?>">
                <span class="nav-icon">🖼️</span>
                <span>Medios / Imágenes</span>
            </a>

            <div class="admin-nav-section-label">SISTEMA & SEO</div>
            <a href="<?= e($siteUrl) ?>/admin/seo.php" class="admin-nav-item <?= $currentPage === 'seo.php' ? 'active' : '' ?>">
                <span class="nav-icon">🔍</span>
                <span>SEO y Sitemaps</span>
            </a>
            <a href="<?= e($siteUrl) ?>/admin/settings.php" class="admin-nav-item <?= $currentPage === 'settings.php' ? 'active' : '' ?>">
                <span class="nav-icon">⚙️</span>
                <span>Configuración</span>
            </a>
        </nav>

        <div class="admin-sidebar-footer">
            <div class="admin-user-profile">
                <div class="admin-user-avatar">👤</div>
                <div class="admin-user-info">
                    <span class="admin-user-name"><?= e($adminName) ?></span>
                    <span class="admin-user-role">Editor Principal</span>
                </div>
            </div>
            <div class="admin-footer-actions">
                <a href="<?= e($siteUrl) ?>/" target="_blank" class="admin-btn-outline" title="Ver sitio web">Ver Web ↗</a>
                <a href="<?= e($siteUrl) ?>/admin/logout.php" class="admin-btn-logout" title="Cerrar sesión">Salir</a>
            </div>
        </div>
    </aside>

    <!-- Admin Main Content Area -->
    <div class="admin-content-area">
        <!-- Admin Top Navigation Bar -->
        <header class="admin-topbar">
            <div class="topbar-left">
                <h1 class="topbar-page-title"><?= e($adminTitle ?? 'Dashboard') ?></h1>
            </div>
            <div class="topbar-right">
                <a href="<?= e($siteUrl) ?>/admin/post-edit.php" class="btn-primary btn-sm">+ Redactar Noticia</a>
                <a href="<?= e($siteUrl) ?>/" target="_blank" class="btn-secondary btn-sm">Ver Portal ↗</a>
            </div>
        </header>

        <main class="admin-main-container">
            <?php if (!empty($_SESSION['flash_message'])): ?>
                <div class="admin-alert <?= e($_SESSION['flash_type'] ?? 'info') ?>">
                    <?= e($_SESSION['flash_message']) ?>
                </div>
                <?php unset($_SESSION['flash_message'], $_SESSION['flash_type']); ?>
            <?php endif; ?>
