/** @typedef {'pb' | 'laravel'} AdminMediaDriver */

export const LARAVEL_ADMIN_TOKEN_KEY = 'sf_laravel_admin_token_v1';

/** @returns {AdminMediaDriver} */
export function getAdminMediaDriver() {
  const raw = (import.meta.env.VITE_ADMIN_MEDIA_DRIVER ?? 'pb').trim().toLowerCase();
  return raw === 'laravel' ? 'laravel' : 'pb';
}

export function isLaravelAdminMedia() {
  return getAdminMediaDriver() === 'laravel';
}

export function resolveAdminApiBaseUrl() {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '');
  if (!base) {
    throw new Error(
      'VITE_API_BASE_URL is required when VITE_ADMIN_MEDIA_DRIVER=laravel.'
    );
  }
  return base;
}
