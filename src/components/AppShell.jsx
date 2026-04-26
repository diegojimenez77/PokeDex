import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();

  const syncHeaderHeight = useCallback(() => {
    const el = headerRef.current;
    if (!el) return;
    const h = el.getBoundingClientRect().height;
    document.documentElement.style.setProperty(
      '--shell-header-height',
      `${Math.max(0, h)}px`
    );
  }, []);

  useEffect(() => {
    syncHeaderHeight();
    window.addEventListener('resize', syncHeaderHeight);
    const el = headerRef.current;
    let ro;
    if (el && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(syncHeaderHeight);
      ro.observe(el);
    }
    return () => {
      window.removeEventListener('resize', syncHeaderHeight);
      if (ro && el) ro.disconnect();
    };
  }, [syncHeaderHeight]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <div
      className={`page-fav-desk dex-scrollbar${sidebarOpen ? ' page-fav-desk--sidebar-open' : ''}`}
    >
      <button
        type="button"
        className="app-side-nav-backdrop"
        id="app-side-nav-backdrop"
        aria-label="Cerrar menú lateral"
        hidden={!sidebarOpen}
        onClick={closeSidebar}
      />
      <aside
        id="app-side-nav"
        className="app-side-nav"
        aria-label="Navegación lateral"
      >
        <div className="app-side-nav__head">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `app-side-nav__brand${isActive ? ' app-side-nav__brand--active' : ''}`
            }
            onClick={closeSidebar}
          >
            <span
              className="material-symbols-outlined app-side-nav__brand-icon"
              aria-hidden="true"
            >
              catching_pokemon
            </span>
            <span className="app-side-nav__brand-text">Prism Dex</span>
          </NavLink>
        </div>
        <div className="app-side-nav__cta">
          <button
            type="button"
            className="app-side-nav__cta-btn app-side-nav__cta-btn--glow app-side-nav__cta-btn--compact"
            onClick={() => {
              navigate('/explorar');
              closeSidebar();
            }}
          >
            Ir a explorar
          </button>
        </div>
        <nav className="app-side-nav__links" aria-label="Secciones principales">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `app-side-nav__link${isActive ? ' app-side-nav__link--active' : ''}`
            }
            onClick={closeSidebar}
          >
            <span className="material-symbols-outlined">home</span>
            Inicio
          </NavLink>
          <NavLink
            to="/explorar"
            className={({ isActive }) =>
              `app-side-nav__link${isActive ? ' app-side-nav__link--active' : ''}`
            }
            onClick={closeSidebar}
          >
            <span className="material-symbols-outlined">capture</span>
            Explorar
          </NavLink>
          <NavLink
            to="/favoritos"
            className={({ isActive }) =>
              `app-side-nav__link${isActive ? ' app-side-nav__link--active' : ''}`
            }
            onClick={closeSidebar}
          >
            <span className="material-symbols-outlined">favorite</span>
            Favoritos
          </NavLink>
        </nav>
      </aside>

      <main className="page-fav-desk__main">
        <header className="page-fav-desk__header" ref={headerRef}>
          <div className="page-fav-desk__header-left">
            <button
              type="button"
              className="page-fav-desk__menu-btn app-side-nav-toggle"
              aria-expanded={sidebarOpen}
              aria-controls="app-side-nav"
              aria-label={
                sidebarOpen
                  ? 'Cerrar menú de navegación'
                  : 'Abrir menú de navegación'
              }
              onClick={toggleSidebar}
            >
              <span
                className="page-fav-desk__menu-icon page-fav-desk__menu-icon--open material-symbols-outlined"
                aria-hidden="true"
              >
                menu
              </span>
              <span
                className="page-fav-desk__menu-icon page-fav-desk__menu-icon--close material-symbols-outlined"
                aria-hidden="true"
              >
                close
              </span>
            </button>
            <NavLink className="page-fav-desk__logo" to="/">
              Prism Dex
            </NavLink>
          </div>
          <div className="page-fav-desk__header-right">
            <HeaderSearch />
            <div className="page-fav-desk__icon-btns">
              <button
                type="button"
                className="page-fav-desk__icon-btn"
                aria-label="Cambiar tema claro u oscuro"
                onClick={toggleTheme}
              >
                <span className="material-symbols-outlined">
                  {isDark ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            </div>
          </div>
        </header>
        <div className="page-fav-desk__scroll dex-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function HeaderSearch() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) {
      navigate('/explorar');
      return;
    }
    navigate(`/explorar?q=${encodeURIComponent(term)}`);
  };

  return (
    <form className="page-fav-desk__search" onSubmit={onSubmit}>
      <span className="material-symbols-outlined page-fav-desk__search-icon">
        search
      </span>
      <label className="visually-hidden" htmlFor="header-search-input">
        Buscar Pokémon
      </label>
      <input
        id="header-search-input"
        className="page-fav-desk__search-input"
        type="search"
        placeholder="Buscar por nombre o número..."
        autoComplete="off"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
    </form>
  );
}
