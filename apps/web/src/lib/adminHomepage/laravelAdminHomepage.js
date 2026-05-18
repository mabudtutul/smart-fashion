import { ADMIN_PATHS } from '@/lib/api/endpoints.js';
import { adminJson } from '@/lib/api/adminClient.js';
import { normalizeListPayload } from '@/lib/api/parse.js';
import { adminUpload } from '@/lib/api/uploads.js';

const inFlightHomepageUploads = new Set();

export const laravelAdminHomepage = {
  async fetchMediaHealth() {
    return adminJson(ADMIN_PATHS.mediaHealth);
  },

  async listHeroSlides(page = 1, perPage = 50) {
    const data = await adminJson(`${ADMIN_PATHS.heroSlides}?page=${page}&perPage=${perPage}`);
    return normalizeListPayload(data);
  },

  async createHeroSlide(payload, options = {}) {
    return adminJson(ADMIN_PATHS.heroSlides, {
      method: 'POST',
      body: JSON.stringify(payload),
      idempotencyKey: options.idempotencyKey,
    });
  },

  async updateHeroSlide(id, payload) {
    return adminJson(ADMIN_PATHS.heroSlide(id), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteHeroSlide(id) {
    return adminJson(ADMIN_PATHS.heroSlide(id), { method: 'DELETE' });
  },

  async uploadHeroImage(id, slot, file, { onProgress, idempotencyKey } = {}) {
    const form = new FormData();
    form.append('image', file);
    form.append('slot', slot);
    return adminUpload(ADMIN_PATHS.heroSlideImage(id), form, {
      onProgress,
      idempotencyKey,
      lockSet: inFlightHomepageUploads,
      lockKey: `hero:${id}:${slot}`,
    });
  },

  async listBanners(page = 1, perPage = 50) {
    const data = await adminJson(`${ADMIN_PATHS.homepageBanners}?page=${page}&perPage=${perPage}`);
    return normalizeListPayload(data);
  },

  async createBanner(payload, options = {}) {
    return adminJson(ADMIN_PATHS.homepageBanners, {
      method: 'POST',
      body: JSON.stringify(payload),
      idempotencyKey: options.idempotencyKey,
    });
  },

  async updateBanner(id, payload) {
    return adminJson(ADMIN_PATHS.homepageBanner(id), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteBanner(id) {
    return adminJson(ADMIN_PATHS.homepageBanner(id), { method: 'DELETE' });
  },

  async uploadBannerImage(id, file, { onProgress, idempotencyKey } = {}) {
    const form = new FormData();
    form.append('image', file);
    return adminUpload(ADMIN_PATHS.homepageBannerImage(id), form, {
      onProgress,
      idempotencyKey,
      lockSet: inFlightHomepageUploads,
      lockKey: `banner:${id}`,
    });
  },
};
