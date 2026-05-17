import { getAdminCatalogDriver, isLaravelAdminCatalog } from '@/lib/adminCatalog/config.js';
import { laravelAdminCatalog } from '@/lib/adminCatalog/laravelAdminCatalog.js';
import { pocketbaseAdminCatalog } from '@/lib/adminCatalog/pocketbaseAdminCatalog.js';

export { getAdminCatalogDriver, isLaravelAdminCatalog } from '@/lib/adminCatalog/config.js';

export const adminCatalog = isLaravelAdminCatalog()
  ? laravelAdminCatalog
  : pocketbaseAdminCatalog;

if (import.meta.env.DEV) {
  console.log('[SmartFashion] admin catalog driver:', getAdminCatalogDriver());
}
