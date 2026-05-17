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

export function resolveAdminApiBaseUrl() {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '');
  if (!base) {
    throw new Error(
      'VITE_API_BASE_URL is required when VITE_ADMIN_MEDIA_DRIVER=laravel.'
    );
  }
  return base;
}
