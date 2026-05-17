import { getBackendDriver, isLaravelCatalog } from '@/lib/catalog/config.js';
import { laravelCatalog } from '@/lib/catalog/laravelCatalog.js';
import { pocketbaseCatalog } from '@/lib/catalog/pocketbaseCatalog.js';

export { getBackendDriver, isLaravelCatalog, resolveApiBaseUrl } from '@/lib/catalog/config.js';
export { getRecordImageUrl } from '@/lib/catalog/recordImageUrl.js';

/** Read-only storefront catalog (PocketBase or Laravel). */
export const catalog = isLaravelCatalog() ? laravelCatalog : pocketbaseCatalog;

if (import.meta.env.DEV) {
  console.log('[SmartFashion] catalog backend driver:', getBackendDriver());
}
