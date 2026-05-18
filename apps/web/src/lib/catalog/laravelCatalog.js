import { PUBLIC_PATHS } from '@/lib/api/endpoints.js';
import { getPublicJson } from '@/lib/api/publicClient.js';
import { normalizeListPayload } from '@/lib/api/parse.js';

export const laravelCatalog = {
  async listCategories(page, perPage, options = {}) {
    const data = await getPublicJson(PUBLIC_PATHS.categories, {
      page,
      perPage,
      sort: options.sort,
    });
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

    const data = await getPublicJson(PUBLIC_PATHS.products, query);
    return normalizeListPayload(data);
  },

  async getProduct(id) {
    return getPublicJson(PUBLIC_PATHS.product(id));
  },
};
