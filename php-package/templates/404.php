<?php
/**
 * 404 Error Template
 */

declare(strict_types=1);

$siteUrl = rtrim(SITE_URL, '/');
?>
<div class="error-page-wrapper">
    <div class="container error-container">
        <span class="error-code">404</span>
        <h1 class="error-title">Página no encontrada</h1>
        <p class="error-desc">La noticia, categoría o página que buscas no existe o ha sido movida.</p>
        <div class="error-actions">
            <a href="<?= e($siteUrl) ?>/" class="btn-primary">Ir a la Portada</a>
            <a href="<?= e($siteUrl) ?>/actualidad/" class="btn-secondary">Ver Actualidad</a>
        </div>
    </div>
</div>
