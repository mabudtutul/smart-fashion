/** @typedef {'pb' | 'laravel'} CatalogBackendDriver */

/** @returns {CatalogBackendDriver} */
export function getBackendDriver() {
  const raw = (import.meta.env.VITE_BACKEND_DRIVER ?? 'pb').trim().toLowerCase();
  return raw === 'laravel' ? 'laravel' : 'pb';
}

export function isLaravelCatalog() {
  return getBackendDriver() === 'laravel';
}

export function resolveApiBaseUrl() {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '');
  if (!base) {
    throw new Error(
      'VITE_API_BASE_URL is required when VITE_BACKEND_DRIVER=laravel (e.g. https://api.smartfashion.site).'
    );
  }
  return base;
}
