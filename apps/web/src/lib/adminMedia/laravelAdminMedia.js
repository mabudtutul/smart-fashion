import { ADMIN_PATHS } from '@/lib/api/endpoints.js';
import {
  clearLegacyPocketBaseAuth,
  getLaravelAdminToken,
  loginLaravelAdmin,
  setLaravelAdminToken,
} from '@/lib/api/auth.js';
import { adminDelete } from '@/lib/api/uploads.js';
import { adminUpload } from '@/lib/api/uploads.js';
import {
  cacheLaravelMediaMeta,
  clearLaravelMediaMeta,
} from '@/lib/adminMedia/mediaCache.js';

export {
  getLaravelAdminToken,
  setLaravelAdminToken,
  clearLegacyPocketBaseAuth,
  loginLaravelAdmin,
};

const inFlightUploads = new Set();

export async function deleteProductImage(productId) {
  const data = await adminDelete(ADMIN_PATHS.productImage(productId));
  clearLaravelMediaMeta(productId);
  return data;
}

export async function deleteCategoryImage(categoryId) {
  const data = await adminDelete(ADMIN_PATHS.categoryImage(categoryId));
  clearLaravelMediaMeta(categoryId);
  return data;
}

export async function uploadProductImage(productId, file, { onProgress, idempotencyKey } = {}) {
  const form = new FormData();
  form.append('image', file);

  const data = await adminUpload(ADMIN_PATHS.productImage(productId), form, {
    onProgress,
    idempotencyKey,
    lockSet: inFlightUploads,
    lockKey: `product-image:${productId}`,
    busyMessage: 'এই পণ্যের ছবি ইতিমধ্যে আপলোড হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।',
  });

  if (data?.record) {
    cacheLaravelMediaMeta(productId, data.record);
  }

  return data;
}

export async function uploadCategoryImage(categoryId, file, { onProgress, idempotencyKey } = {}) {
  const form = new FormData();
  form.append('image', file);

  const data = await adminUpload(ADMIN_PATHS.categoryImage(categoryId), form, {
    onProgress,
    idempotencyKey,
    lockSet: inFlightUploads,
    lockKey: `category-image:${categoryId}`,
    busyMessage: 'এই ক্যাটাগরির ছবি ইতিমধ্যে আপলোড হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।',
  });

  if (data?.record) {
    cacheLaravelMediaMeta(categoryId, data.record);
  }

  return data;
}
