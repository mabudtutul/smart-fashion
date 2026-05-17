import { resolveApiBaseUrl } from '@/lib/catalog/config.js';

function v1Url(path, query = {}) {
  const base = resolveApiBaseUrl();
  const url = new URL(`/api/v1${path}`, `${base}/`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    const error = new Error(`Catalog API ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export const laravelCatalog = {
  async listCategories(page, perPage, options = {}) {
    return fetchJson(
      v1Url('/categories', {
        page,
        perPage,
        sort: options.sort,
      })
    );
  },

  async listProducts(page, perPage, options = {}) {
    return fetchJson(
      v1Url('/products', {
        page,
        perPage,
        sort: options.sort,
        filter: options.filter,
      })
    );
  },

  async getProduct(id) {
    return fetchJson(v1Url(`/products/${encodeURIComponent(id)}`));
  },
};
