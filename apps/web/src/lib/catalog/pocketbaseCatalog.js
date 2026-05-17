import pb from '@/lib/pocketbaseClient.js';

const defaultListOptions = { $autoCancel: false };

export const pocketbaseCatalog = {
  async listCategories(page, perPage, options = {}) {
    return pb.collection('categories').getList(page, perPage, {
      ...defaultListOptions,
      ...options,
    });
  },

  async listProducts(page, perPage, options = {}) {
    return pb.collection('products').getList(page, perPage, {
      ...defaultListOptions,
      ...options,
    });
  },

  async getProduct(id) {
    return pb.collection('products').getOne(id, { $autoCancel: false });
  },
};
