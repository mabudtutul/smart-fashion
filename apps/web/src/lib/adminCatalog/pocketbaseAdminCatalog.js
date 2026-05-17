import pb from '@/lib/pocketbaseClient.js';

const defaultListOptions = { $autoCancel: false };

export const pocketbaseAdminCatalog = {
  listProducts(page, perPage, options = {}) {
    return pb.collection('products').getList(page, perPage, {
      ...defaultListOptions,
      ...options,
    });
  },

  listCategories(page, perPage, options = {}) {
    return pb.collection('categories').getList(page, perPage, {
      ...defaultListOptions,
      ...options,
    });
  },

  getProduct(id) {
    return pb.collection('products').getOne(id, { $autoCancel: false });
  },

  getCategory(id) {
    return pb.collection('categories').getOne(id, { $autoCancel: false });
  },

  createProduct(payload) {
    return pb.collection('products').create(payload);
  },

  updateProduct(id, payload) {
    return pb.collection('products').update(id, payload);
  },

  deleteProduct(id) {
    return pb.collection('products').delete(id);
  },

  createCategory(payload) {
    return pb.collection('categories').create(payload);
  },

  updateCategory(id, payload) {
    return pb.collection('categories').update(id, payload);
  },

  deleteCategory(id) {
    return pb.collection('categories').delete(id);
  },
};
