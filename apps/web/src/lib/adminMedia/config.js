import { readDriver } from '@/lib/envDrivers.js';

export { LARAVEL_ADMIN_TOKEN_KEY } from '@/lib/api/auth.js';
export {
  resolveApiBaseUrl as resolveAdminApiBaseUrl,
  resolveApiV1Base,
  siteOriginUrl,
} from '@/lib/api/config.js';

export function getAdminMediaDriver() {
  return readDriver('VITE_ADMIN_MEDIA_DRIVER');
}

export function isLaravelAdminMedia() {
  return getAdminMediaDriver() === 'laravel';
}
