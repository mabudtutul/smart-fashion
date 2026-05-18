import { readDriver } from '@/lib/envDrivers.js';

/** @typedef {'pb' | 'laravel'} CatalogBackendDriver */

/** @returns {CatalogBackendDriver} */
export function getBackendDriver() {
  return readDriver('VITE_BACKEND_DRIVER');
}

export function isLaravelCatalog() {
  return getBackendDriver() === 'laravel';
}

/** Site origin for uploads, Sanctum CSRF, and absolute /uploads paths. */
export function resolveApiBaseUrl() {
  const site = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '');
  const apiUrl = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '');

  if (site && !site.endsWith('/api')) {
    return site;
  }

  if (apiUrl.endsWith('/api')) {
    return apiUrl.slice(0, -4);
  }

  if (site) {
    return site.replace(/\/api$/, '') || site;
  }

  throw new Error(
    'VITE_API_BASE_URL or VITE_API_URL is required when VITE_BACKEND_DRIVER=laravel.'
  );
}

/** Laravel JSON API prefix — https://smartfashion.site/api/v1 */
export function resolveApiV1Base() {
  const apiUrl = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '');
  if (apiUrl) {
    return `${apiUrl}/v1`;
  }

  return `${resolveApiBaseUrl()}/api/v1`;
}
