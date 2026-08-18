/**
 * PULSO EDITORIAL - Main Vanilla JavaScript
 * Lightweight, zero-dependency, high performance
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Reading Progress Bar (Single Article View)
  const progressBar = document.getElementById('readingProgressBar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  // 2. Search Modal Toggle
  const searchTrigger = document.getElementById('searchTriggerBtn');
  const searchModal = document.getElementById('searchModal');
  const searchClose = document.getElementById('searchModalClose');
  const searchInput = document.getElementById('searchModalInput');

  if (searchTrigger && searchModal) {
    searchTrigger.addEventListener('click', () => {
      searchModal.classList.add('open');
      if (searchInput) searchInput.focus();
    });

    if (searchClose) {
      searchClose.addEventListener('click', () => {
        searchModal.classList.remove('open');
      });
    }

    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        searchModal.classList.remove('open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal.classList.contains('open')) {
        searchModal.classList.remove('open');
      }
    });
  }

  // 3. Mobile Navigation Drawer
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const drawerClose = document.getElementById('drawerCloseBtn');

  const openDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (mobileBtn) mobileBtn.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);

  // 4. Horizontal Scroll Slider Arrows
  const scrollContainer = document.getElementById('featuredScrollContainer');
  const slideLeft = document.getElementById('slideLeftBtn');
  const slideRight = document.getElementById('slideRightBtn');

  if (scrollContainer && slideLeft && slideRight) {
    slideLeft.addEventListener('click', () => {
      scrollContainer.scrollBy({ left: -320, behavior: 'smooth' });
    });
    slideRight.addEventListener('click', () => {
      scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }

  // 5. Copy Article Link Button
  const copyBtn = document.getElementById('copyArticleLinkBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const url = copyBtn.dataset.url || window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = '¡Copiado! ✓';
        copyBtn.style.backgroundColor = '#16a34a';
        copyBtn.style.color = '#ffffff';
        setTimeout(() => {
          copyBtn.innerText = originalText;
          copyBtn.style.backgroundColor = '';
          copyBtn.style.color = '';
        }, 2000);
      });
    });
  }
});
