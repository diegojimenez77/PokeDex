import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import '@design/tokens.css';
import '@design/base.css';
import '@design/components.css';
import '@design/layout-shell.css';
import '@design/page-favoritos-escritorio.css';
import '@design/page-favoritos-movil.css';
import '@design/page-explorar.css';
import '@design/page-detalle-movil.css';
import '@design/page-landing.css';
import './styles/theme-light.css';
import './styles/app.css';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import App from './App.jsx';

const storedTheme = localStorage.getItem('prism-dex-theme');
if (storedTheme === 'light') {
  document.documentElement.classList.add('theme-light');
  document.documentElement.classList.remove('dark');
} else {
  document.documentElement.classList.add('dark');
  document.documentElement.classList.remove('theme-light');
}

const useFileProtocol =
  typeof window !== 'undefined' && window.location.protocol === 'file:';

const rawBase = import.meta.env.BASE_URL;
let routerBasename;
if (typeof rawBase === 'string' && !rawBase.startsWith('.')) {
  const noTrailing = rawBase.replace(/\/$/, '');
  if (noTrailing) {
    routerBasename = noTrailing;
  }
}

const Router = useFileProtocol ? HashRouter : BrowserRouter;
const routerProps =
  !useFileProtocol && routerBasename ? { basename: routerBasename } : {};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router {...routerProps}>
      <ThemeProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </ThemeProvider>
    </Router>
  </StrictMode>
);
