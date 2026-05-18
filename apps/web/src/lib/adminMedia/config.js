import { readDriver } from '@/lib/envDrivers.js';

/** @typedef {'pb' | 'laravel'} AdminMediaDriver */

export const LARAVEL_ADMIN_TOKEN_KEY = 'sf_laravel_admin_token_v1';

/** @returns {AdminMediaDriver} */
export function getAdminMediaDriver() {
  return readDriver('VITE_ADMIN_MEDIA_DRIVER');
}

export function isLaravelAdminMedia() {
  return getAdminMediaDriver() === 'laravel';
}

export { resolveApiBaseUrl as resolveAdminApiBaseUrl, resolveApiV1Base } from '@/lib/catalog/config.js';
