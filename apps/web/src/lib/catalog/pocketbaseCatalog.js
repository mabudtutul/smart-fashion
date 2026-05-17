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
    const { category, featured, bestseller, new: isNew, ...rest } = options;
    const filterParts = [];
    if (category) {
      filterParts.push(`category = ${JSON.stringify(category)}`);
    }
    if (featured === true) filterParts.push('featured = true');
    if (bestseller === true) filterParts.push('bestseller = true');
    if (isNew === true) filterParts.push('new = true');

    return pb.collection('products').getList(page, perPage, {
      ...defaultListOptions,
      ...rest,
      ...(filterParts.length ? { filter: filterParts.join(' && ') } : {}),
    });
  },

  async getProduct(id) {
    return pb.collection('products').getOne(id, { $autoCancel: false });
  },
};
