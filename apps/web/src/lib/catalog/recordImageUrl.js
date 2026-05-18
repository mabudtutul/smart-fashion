import { resolveApiBaseUrl } from '@/lib/api/config.js';

function resolveLaravelApiBase() {
  return resolveApiBaseUrl();
}

function collectionFolder(record) {
  if (record.collectionName === 'categories' || record.collectionId === 'categories') {
    return 'categories';
  }
  return 'products';
}

/** @param {string} url */
export function normalizeMediaUrl(url) {
  const raw = String(url ?? '').trim();
  if (!raw) return null;
  if (raw.startsWith('data:') || raw.startsWith('blob:')) return raw;

  if (raw.startsWith('//')) {
    const protocol =
      typeof window !== 'undefined' && window.location?.protocol
        ? window.location.protocol
        : 'https:';
    return `${protocol}${raw}`;
  }

  if (raw.startsWith('/')) {
    const base = resolveLaravelApiBase();
    const path = raw.startsWith('/uploads') ? raw : `/uploads${raw}`;
    return `${base}${path}`;
  }

  if (
    typeof window !== 'undefined' &&
    window.location?.protocol === 'https:' &&
    raw.startsWith('http://')
  ) {
    return raw.replace(/^http:\/\//i, 'https://');
  }

  return raw;
}

/** @param {string} relativePath */
function buildLaravelUploadUrl(relativePath) {
  const base = resolveLaravelApiBase();
  let path = String(relativePath).replace(/^\/+/, '').replace(/\\/g, '/');
  if (path.startsWith('uploads/')) {
    path = path.slice('uploads/'.length);
  }
  return normalizeMediaUrl(`${base}/uploads/${path}`);
}

const LARAVEL_SIZE_KEYS = {
  '80x80': 'thumb',
  '96x96': 'thumb',
  '120x120': 'thumb',
  '150x150': 'thumb',
  '300x300': 'card',
  '600x600': 'main',
  '600x400': 'banner',
};

const PRODUCT_VARIANTS = ['card', 'main', 'thumb'];
const CATEGORY_VARIANTS = ['banner', 'thumb'];
const IMAGE_EXTENSIONS = ['webp', 'jpg', 'jpeg'];

function pushUnique(list, url) {
  if (!url) return;
  const normalized = normalizeMediaUrl(url);
  if (normalized && !list.includes(normalized)) {
    list.push(normalized);
  }
}

function laravelVariantCandidates(record, preferredKey) {
  const folder = collectionFolder(record);
  const id = record.id;
  if (!id) return [];

  const variants = folder === 'categories' ? CATEGORY_VARIANTS : PRODUCT_VARIANTS;
  const ordered = preferredKey
    ? [preferredKey, ...variants.filter((v) => v !== preferredKey)]
    : variants;

  const out = [];
  for (const name of ordered) {
    for (const ext of IMAGE_EXTENSIONS) {
      pushUnique(out, buildLaravelUploadUrl(`${folder}/${id}/${name}.${ext}`));
    }
  }
  return out;
}

/**
 * Ordered image URL candidates (best first) for img onError fallback chains.
 * @param {Record<string, unknown> | null | undefined} record
 * @param {{ thumb?: string, size?: string }} [options]
 * @returns {string[]}
 */
export function getRecordImageCandidates(record, options = {}) {
  if (!record) return [];

  const out = [];
  const preferredKey = options.size ?? LARAVEL_SIZE_KEYS[options.thumb];

  const urls = record.image_urls;
  if (urls && typeof urls === 'object') {
    const keys = preferredKey
      ? [preferredKey, 'card', 'main', 'banner', 'thumb']
      : ['card', 'main', 'banner', 'thumb'];
    for (const key of keys) {
      if (urls[key]) pushUnique(out, urls[key]);
    }
    Object.values(urls).forEach((u) => pushUnique(out, u));
  }

  pushUnique(out, record.image_url);
  if (record.image_path) {
    pushUnique(out, buildLaravelUploadUrl(record.image_path));
  }

  out.push(...laravelVariantCandidates(record, preferredKey));

  const file = record.image ? String(record.image).replace(/^\/+/, '') : '';
  if (file) {
    if (file.includes('/')) {
      pushUnique(out, buildLaravelUploadUrl(file));
    } else if (record.id) {
      pushUnique(out, buildLaravelUploadUrl(`${collectionFolder(record)}/${record.id}/${file}`));
    }
  }

  return out;
}

/**
 * @param {Record<string, unknown> | null | undefined} record
 * @param {{ thumb?: string, size?: string }} [options]
 */
export function getRecordImageUrl(record, options = {}) {
  return getRecordImageCandidates(record, options)[0] ?? null;
}
