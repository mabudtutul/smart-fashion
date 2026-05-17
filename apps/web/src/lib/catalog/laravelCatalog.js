import { resolveApiBaseUrl } from '@/lib/catalog/config.js';
import { fetchCatalogJson, normalizeListPayload } from '@/lib/catalog/catalogHttp.js';

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

export const laravelCatalog = {
  async listCategories(page, perPage, options = {}) {
    const data = await fetchCatalogJson(
      v1Url('/categories', {
        page,
        perPage,
        sort: options.sort,
      })
    );
    return normalizeListPayload(data);
  },

  async listProducts(page, perPage, options = {}) {
    const query = {
      page,
      perPage,
      sort: options.sort,
      filter: options.filter,
    };
    if (options.category) {
      query.category = options.category;
    }
    if (options.featured === true) {
      query.featured = 'true';
    }
    if (options.bestseller === true) {
      query.bestseller = 'true';
    }
    if (options.new === true) {
      query.new = 'true';
    }

    const data = await fetchCatalogJson(v1Url('/products', query));
    return normalizeListPayload(data);
  },

  async getProduct(id) {
    return fetchCatalogJson(v1Url(`/products/${encodeURIComponent(id)}`));
  },
};
