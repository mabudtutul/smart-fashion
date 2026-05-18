const CACHE_KEY = 'sf_laravel_media_meta_v1';

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function cacheLaravelMediaMeta(id, record) {
  if (!id || !record) return;
  const cache = readCache();
  cache[id] = {
    image: record.image ?? '',
    image_url: record.image_url ?? null,
    image_urls: record.image_urls ?? null,
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export function applyLaravelMediaCache(items) {
  const cache = readCache();
  return items.map((item) => {
    const meta = cache[item.id];
    if (!meta) return item;
    return {
      ...item,
      image: item.image || meta.image || '',
      image_url: item.image_url ?? meta.image_url ?? null,
      image_urls: item.image_urls ?? meta.image_urls ?? null,
    };
  });
}

export function clearLaravelMediaMeta(id) {
  if (!id) return;
  const cache = readCache();
  if (!cache[id]) return;
  delete cache[id];
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export function clearLaravelMediaCache() {
  localStorage.removeItem(CACHE_KEY);
}
