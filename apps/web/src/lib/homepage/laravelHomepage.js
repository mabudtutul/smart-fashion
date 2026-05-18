import { resolveApiV1Base } from '@/lib/catalog/config.js';
import { fetchCatalogJson } from '@/lib/catalog/catalogHttp.js';

function v1Url(path) {
  return `${resolveApiV1Base()}${path}`;
}

/** @returns {Promise<{ hero_slides: unknown[], banners: unknown[] }>} */
export async function fetchHomepage() {
  const data = await fetchCatalogJson(v1Url('/homepage'));
  const unwrap = (value) => (Array.isArray(value) ? value : value?.data ?? []);

  return {
    hero_slides: unwrap(data?.hero_slides),
    banners: unwrap(data?.banners),
  };
}
