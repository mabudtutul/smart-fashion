import { adminApiUrl, adminAuthorizedJson } from '@/lib/adminCatalog/laravelAdminApi.js';

function adminListUrl(path, query = {}) {
  const url = adminApiUrl(path);
  const parsed = new URL(url);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      parsed.searchParams.set(key, String(value));
    }
  });
  return parsed.toString();
}

export const laravelAdminCatalog = {
  listProducts(page, perPage, options = {}) {
    return adminAuthorizedJson(
      adminListUrl('/products', {
        page,
        perPage,
        sort: options.sort,
        filter: options.filter,
      })
    );
  },

  listCategories(page, perPage, options = {}) {
    return adminAuthorizedJson(
      adminListUrl('/categories', {
        page,
        perPage,
        sort: options.sort,
        filter: options.filter,
      })
    );
  },

  getProduct(id) {
    return adminAuthorizedJson(adminApiUrl(`/products/${encodeURIComponent(id)}`));
  },

  getCategory(id) {
    return adminAuthorizedJson(adminApiUrl(`/categories/${encodeURIComponent(id)}`));
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
