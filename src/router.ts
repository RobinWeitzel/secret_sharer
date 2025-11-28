import { renderDecryptPage } from './pages/decrypt';
import { renderEncryptPage } from './pages/encrypt';

function getCurrentPath(): string {
  const basePath = '/secret_sharer';
  const path = window.location.pathname;
  return path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;
}

function renderCurrentPage(): void {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;

  const path = getCurrentPath();
  app.innerHTML = path === '/encrypt' ? renderEncryptPage() : renderDecryptPage();
  attachNavLinks();
}

function attachNavLinks(): void {
  document.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = (e.target as HTMLElement).getAttribute('data-link');
      if (path) navigate(path);
    });
  });
}

export function navigate(path: string): void {
  window.history.pushState({}, '', '/secret_sharer' + path);
  renderCurrentPage();
}

export function initRouter(): void {
  window.addEventListener('popstate', renderCurrentPage);
  renderCurrentPage();
}
