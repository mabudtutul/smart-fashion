import { adminApiUrl, adminAuthorizedJson } from '@/lib/adminCatalog/laravelAdminApi.js';
import { resolveApiBaseUrl } from '@/lib/catalog/config.js';

function publicAdminUrl(path, query = {}) {
  const base = resolveApiBaseUrl();
  const url = new URL(`/api/v1/admin${path}`, `${base}/`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function fetchPublicJson(url) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.message || `Admin catalog API ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const laravelAdminCatalog = {
  listProducts(page, perPage, options = {}) {
    return fetchPublicJson(
      publicAdminUrl('/products', {
        page,
        perPage,
        sort: options.sort,
        filter: options.filter,
      })
    );
  },

  listCategories(page, perPage, options = {}) {
    return fetchPublicJson(
      publicAdminUrl('/categories', {
        page,
        perPage,
        sort: options.sort,
        filter: options.filter,
      })
    );
  },

  getProduct(id) {
    return fetchPublicJson(publicAdminUrl(`/products/${encodeURIComponent(id)}`));
  },

  getCategory(id) {
    return fetchPublicJson(publicAdminUrl(`/categories/${encodeURIComponent(id)}`));
  },

  createProduct(payload) {
    return adminAuthorizedJson(adminApiUrl('/products'), {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateProduct(id, payload) {
    return adminAuthorizedJson(adminApiUrl(`/products/${encodeURIComponent(id)}`), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteProduct(id) {
    return adminAuthorizedJson(adminApiUrl(`/products/${encodeURIComponent(id)}`), {
      method: 'DELETE',
    });
  },

  createCategory(payload) {
    return adminAuthorizedJson(adminApiUrl('/categories'), {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateCategory(id, payload) {
    return adminAuthorizedJson(adminApiUrl(`/categories/${encodeURIComponent(id)}`), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteCategory(id) {
    return adminAuthorizedJson(adminApiUrl(`/categories/${encodeURIComponent(id)}`), {
      method: 'DELETE',
    });
  },
};
