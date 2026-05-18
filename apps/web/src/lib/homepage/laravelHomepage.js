import { PUBLIC_PATHS } from '@/lib/api/endpoints.js';
import { getPublicJson } from '@/lib/api/publicClient.js';

/** @returns {Promise<{ hero_slides: unknown[], banners: unknown[] }>} */
export async function fetchHomepage() {
  const data = await getPublicJson(PUBLIC_PATHS.homepage);
  const unwrap = (value) => (Array.isArray(value) ? value : value?.data ?? []);

  return {
    hero_slides: unwrap(data?.hero_slides),
    banners: unwrap(data?.banners),
  };
}
