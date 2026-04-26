/**
 * Muestra u oculta la barra lateral (.app-side-nav) en las maquetaciones design/.
 */
(function () {
  const shell = document.querySelector('.page-fav-desk');
  if (!shell) return;

  const toggle = document.querySelector('.app-side-nav-toggle');
  const backdrop = document.getElementById('app-side-nav-backdrop');
  const nav = document.getElementById('app-side-nav');
  const header = document.querySelector('.page-fav-desk__header');

  function syncShellHeaderHeight() {
    if (!header) return;
    const h = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty(
      '--shell-header-height',
      Math.max(0, h) + 'px'
    );
  }

  syncShellHeaderHeight();
  window.addEventListener('resize', syncShellHeaderHeight);
  if (header && typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(syncShellHeaderHeight).observe(header);
  }

  function setOpen(open) {
    shell.classList.toggle('page-fav-desk--sidebar-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute(
        'aria-label',
        open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
      );
    }
    if (backdrop) {
      if (open) backdrop.removeAttribute('hidden');
      else backdrop.setAttribute('hidden', '');
    }
  }

  function isOpen() {
    return shell.classList.contains('page-fav-desk--sidebar-open');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setOpen(!isOpen());
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', function () {
      setOpen(false);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) setOpen(false);
  });

  if (nav) {
    nav.addEventListener('click', function (e) {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('#')) setOpen(false);
    });
  }
})();
