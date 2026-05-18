import { readDriver } from '@/lib/envDrivers.js';

export {
  resolveApiBaseUrl,
  resolveApiV1Base,
  siteOriginUrl,
  v1Url,
  adminUrl,
} from '@/lib/api/config.js';

export function isLaravelCatalog() {
  return readDriver('VITE_BACKEND_DRIVER') === 'laravel';
}
