import { laravelCatalog } from '@/lib/catalog/laravelCatalog.js';

export { isLaravelCatalog, resolveApiBaseUrl, resolveApiV1Base } from '@/lib/catalog/config.js';
export {
  getRecordImageUrl,
  getRecordImageCandidates,
  normalizeMediaUrl,
} from '@/lib/catalog/recordImageUrl.js';
export { CatalogApiError, catalogErrorMessage, isCatalogApiError } from '@/lib/catalog/catalogHttp.js';

export const catalog = laravelCatalog;
