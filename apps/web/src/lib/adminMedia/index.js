import { isLaravelAdminCatalog } from '@/lib/adminCatalog/config.js';
import { isLaravelAdminMedia } from '@/lib/adminMedia/config.js';
import {
  deleteCategoryImage,
  deleteProductImage,
  loginLaravelAdmin,
  setLaravelAdminToken,
  syncCategoryToLaravel,
  syncProductToLaravel,
  uploadCategoryImage,
  uploadProductImage,
} from '@/lib/adminMedia/laravelAdminMedia.js';
import {
  applyLaravelMediaCache,
  clearLaravelMediaCache,
} from '@/lib/adminMedia/mediaCache.js';

export {
  getAdminMediaDriver,
  isLaravelAdminMedia,
  LARAVEL_ADMIN_TOKEN_KEY,
} from '@/lib/adminMedia/config.js';

export { cacheLaravelMediaMeta } from '@/lib/adminMedia/mediaCache.js';

export async function ensureLaravelMediaAuth(email, password) {
  if (!isLaravelAdminMedia()) return;
  await loginLaravelAdmin(email, password);
}

export async function afterProductSaved(record, imageFile, options = {}) {
  if (!isLaravelAdminMedia()) return record;

  if (!isLaravelAdminCatalog()) {
    await syncProductToLaravel(record);
  }

  if (imageFile) {
    const result = await uploadProductImage(record.id, imageFile, {
      ...options,
      idempotencyKey: options.idempotencyKey
        ? `${options.idempotencyKey}:image`
        : undefined,
    });
    return result?.record ?? record;
  }

  if (options.removeImage) {
    const result = await deleteProductImage(record.id);
    return result?.record ?? record;
  }

  return record;
}

export async function afterCategorySaved(record, imageFile, options = {}) {
  if (!isLaravelAdminMedia()) return record;

  if (!isLaravelAdminCatalog()) {
    await syncCategoryToLaravel(record);
  }

  if (imageFile) {
    const result = await uploadCategoryImage(record.id, imageFile, {
      ...options,
      idempotencyKey: options.idempotencyKey
        ? `${options.idempotencyKey}:image`
        : undefined,
    });
    return result?.record ?? record;
  }

  if (options.removeImage) {
    const result = await deleteCategoryImage(record.id);
    return result?.record ?? record;
  }

  return record;
}

export function enrichAdminList(items) {
  if (isLaravelAdminCatalog() || isLaravelAdminMedia()) {
    return applyLaravelMediaCache(items);
  }
  return items;
}

export function clearAdminMediaSession() {
  setLaravelAdminToken('');
  clearLaravelMediaCache();
}
