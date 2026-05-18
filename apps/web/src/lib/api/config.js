/**
 * Single source for Laravel API URL resolution.
 * Contract: VITE_API_BASE_URL=https://smartfashion.site/api/v1
 */

export function resolveApiBaseUrl() {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '');
  if (!base) {
    throw new Error('VITE_API_BASE_URL is required.');
  }
  if (base.endsWith('/api/v1')) {
    return base.replace(/\/api\/v1$/, '');
  }
  if (base.endsWith('/api')) {
    return base.replace(/\/api$/, '');
  }
  return base;
}

/** @returns {string} e.g. https://smartfashion.site/api/v1 */
export function resolveApiV1Base() {
  const base = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '');
  if (!base) {
    throw new Error('VITE_API_BASE_URL is required.');
  }
  if (base.endsWith('/api/v1')) {
    return base;
  }
  return `${resolveApiBaseUrl()}/api/v1`;
}

/** Site origin for uploads + Sanctum CSRF. */
export function siteOriginUrl() {
  return resolveApiBaseUrl();
}

/**
 * @param {string} path Must start with / (e.g. /categories)
 * @param {Record<string, string | number | boolean | undefined | null>} [query]
 */
export function v1Url(path, query = {}) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${resolveApiV1Base()}${normalized}`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

/**
 * @param {string} adminPath e.g. /products or /products/1
 */
export function adminUrl(adminPath) {
  const path = adminPath.startsWith('/') ? adminPath : `/${adminPath}`;
  return new URL(`/admin${path}`, `${resolveApiV1Base()}/`).toString();
}
