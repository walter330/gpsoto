<?php
/**
 * Public Footer Template
 */

declare(strict_types=1);

require_once __DIR__ . '/functions.php';

$siteName = get_setting('site_name', 'PULSO EDITORIAL');
$footerAbout = get_setting('footer_about', 'Periodismo independiente, análisis económico y tecnológico riguroso.');
$siteUrl = rtrim(SITE_URL, '/');
$categories = get_categories();
$currentYear = date('Y');
?>
    </main>

    <!-- Public Footer -->
    <footer class="site-footer">
        <div class="container footer-container">
            <div class="footer-grid">
                <!-- Column 1: Brand & About -->
                <div class="footer-col brand-col">
                    <a href="<?= e($siteUrl) ?>/" class="site-brand footer-brand">
                        <span class="brand-name"><?= e($siteName) ?></span>
                    </a>
                    <p class="footer-text"><?= e($footerAbout) ?></p>
                    <div class="footer-social-links">
                        <?php if ($tw = get_setting('twitter_handle')): ?>
                            <a href="https://twitter.com/<?= e(ltrim($tw, '@')) ?>" target="_blank" rel="noopener" aria-label="Twitter / X">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            </a>
                        <?php endif; ?>
                        <?php if ($fb = get_setting('facebook_url')): ?>
                            <a href="<?= e($fb) ?>" target="_blank" rel="noopener" aria-label="Facebook">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            </a>
                        <?php endif; ?>
                        <?php if ($li = get_setting('linkedin_url')): ?>
                            <a href="<?= e($li) ?>" target="_blank" rel="noopener" aria-label="LinkedIn">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                            </a>
                        <?php endif; ?>
                        <a href="<?= e($siteUrl) ?>/feed/" aria-label="RSS Feed" title="Feed RSS">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93v-2.83Z"/></svg>
                        </a>
                    </div>
                </div>

                <!-- Column 2: Editorial Sections -->
                <div class="footer-col">
                    <h4 class="footer-col-title">Secciones</h4>
                    <ul class="footer-links">
                        <li><a href="<?= e($siteUrl) ?>/">Portada</a></li>
                        <?php foreach ($categories as $cat): ?>
                            <li><a href="<?= e($siteUrl) ?>/<?= e($cat['slug']) ?>/"><?= e($cat['name']) ?></a></li>
                        <?php endforeach; ?>
                    </ul>
                </div>

                <!-- Column 3: Transparency & Legal -->
                <div class="footer-col">
                    <h4 class="footer-col-title">Transparencia & SEO</h4>
                    <ul class="footer-links">
                        <li><a href="<?= e($siteUrl) ?>/sitemap.xml">Mapa del Sitio (Sitemap XML)</a></li>
                        <li><a href="<?= e($siteUrl) ?>/news-sitemap.xml">Google News Sitemap</a></li>
                        <li><a href="<?= e($siteUrl) ?>/feed/">Canal RSS 2.0</a></li>
                        <li><a href="<?= e($siteUrl) ?>/robots.txt">Directivas Robots.txt</a></li>
                        <li><a href="<?= e($siteUrl) ?>/admin/">Acceso Redacción (CMS)</a></li>
                    </ul>
                </div>

                <!-- Column 4: Newsletter Box -->
                <div class="footer-col newsletter-col">
                    <h4 class="footer-col-title">Boletín Informativo</h4>
                    <p class="footer-text">Recibe nuestro resumen editorial semanal con los análisis y noticias más trascendentales.</p>
                    <form class="footer-newsletter-form" onsubmit="event.preventDefault(); alert('¡Gracias por suscribirte al boletín!');">
                        <input type="email" placeholder="Tu correo electrónico..." required>
                        <button type="submit" class="btn-primary">Suscribirme</button>
                    </form>
                </div>
            </div>

            <!-- Footer Bottom Bar -->
            <div class="footer-bottom">
                <p>&copy; <?= $currentYear ?> <?= e($siteName) ?>. Todos los derechos reservados. Periodismo digital con infraestructura PHP 8+ y MySQL.</p>
                <div class="footer-bottom-links">
                    <span>Privacidad</span>
                    <span>Términos de Uso</span>
                    <span>Código Ético</span>
                </div>
            </div>
        </div>
    </footer>

    <!-- JavaScript Vanilla -->
    <script src="<?= e($siteUrl) ?>/assets/js/main.js"></script>
</body>
</html>
