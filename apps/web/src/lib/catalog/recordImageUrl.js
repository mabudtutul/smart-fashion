import { isLaravelAdminMedia } from '@/lib/adminMedia/config.js';
import pb from '@/lib/pocketbaseClient.js';
import { isLaravelCatalog, resolveApiBaseUrl } from '@/lib/catalog/config.js';

function useLaravelImageUrls() {
  return isLaravelCatalog() || isLaravelAdminMedia();
}

function resolveLaravelApiBase() {
  return resolveApiBaseUrl();
}

/**
 * Resolve display URL for a category/product record (PocketBase or Laravel).
 * @param {Record<string, unknown> | null | undefined} record
 * @param {{ thumb?: string }} [options]
 */
const LARAVEL_SIZE_KEYS = {
  '80x80': 'thumb',
  '96x96': 'thumb',
  '120x120': 'thumb',
  '150x150': 'thumb',
  '300x300': 'card',
  '600x600': 'main',
  '600x400': 'banner',
};

export function getRecordImageUrl(record, options = {}) {
  if (!record) return null;

  const urls = record.image_urls;
  if (urls && typeof urls === 'object') {
    const sizeKey = options.size ?? LARAVEL_SIZE_KEYS[options.thumb];
    if (sizeKey && urls[sizeKey]) {
      return String(urls[sizeKey]);
    }
    if (urls.card) return String(urls.card);
    if (urls.main) return String(urls.main);
    if (urls.banner) return String(urls.banner);
    if (urls.thumb) return String(urls.thumb);
  }

  if (record.image_url) {
    return String(record.image_url);
  }

  if (!record.image) {
    return null;
  }

  if (useLaravelImageUrls()) {
    const base = resolveLaravelApiBase();
    const file = String(record.image).replace(/^\/+/, '');
    const folder =
      record.collectionName === 'categories' || record.collectionId === 'categories'
        ? 'categories'
        : 'products';
    if (record.id && !file.includes('/')) {
      return `${base}/uploads/${folder}/${record.id}/${file}`;
    }
    return `${base}/uploads/${folder}/${file}`;
  }

  return pb.files.getUrl(record, record.image, { thumb: options.thumb ?? '300x300' });
}
