import {
  ADMIN_JSON_TIMEOUT_MS,
  ADMIN_UPLOAD_TIMEOUT_MS,
  fetchWithTimeout,
  parseApiErrorMessage,
} from '@/lib/adminHttp.js';
import { getLaravelAdminToken } from '@/lib/adminMedia/laravelAdminMedia.js';
import { resolveApiV1Base } from '@/lib/adminMedia/config.js';
import { normalizeListPayload } from '@/lib/catalog/catalogHttp.js';

function apiUrl(path) {
  return `${resolveApiV1Base()}${path}`;
}

async function authorizedJson(path, options = {}) {
  const token = getLaravelAdminToken();
  if (!token) {
    throw new Error('Admin session expired. Please log in again.');
  }

  const { idempotencyKey, headers: extraHeaders, ...fetchOptions } = options;
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    ...(fetchOptions.body ? { 'Content-Type': 'application/json' } : {}),
    ...(extraHeaders || {}),
  };
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }

  const response = await fetchWithTimeout(
    apiUrl(path),
    {
      ...fetchOptions,
      headers,
    },
    ADMIN_JSON_TIMEOUT_MS
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = parseApiErrorMessage(data, response.status, `Request failed (${response.status}).`);
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

const inFlightHomepageUploads = new Set();

function uploadMultipart(path, formData, onProgress, idempotencyKey, lockKey) {
  if (lockKey && inFlightHomepageUploads.has(lockKey)) {
    return Promise.reject(new Error('আপলোড ইতিমধ্যে চলছে। অনুগ্রহ করে অপেক্ষা করুন।'));
  }
  if (lockKey) {
    inFlightHomepageUploads.add(lockKey);
  }

  return new Promise((resolve, reject) => {
    const token = getLaravelAdminToken();
    const xhr = new XMLHttpRequest();
    xhr.open('POST', apiUrl(path));
    xhr.timeout = ADMIN_UPLOAD_TIMEOUT_MS;
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    if (idempotencyKey) {
      xhr.setRequestHeader('Idempotency-Key', idempotencyKey);
    }

    const release = () => {
      if (lockKey) {
        inFlightHomepageUploads.delete(lockKey);
      }
    };

    if (typeof onProgress === 'function') {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      });
    }

    xhr.addEventListener('load', () => {
      let data = {};
      try {
        data = JSON.parse(xhr.responseText || '{}');
      } catch {
        /* ignore */
      }
      release();
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
        return;
      }
      reject(Object.assign(new Error(parseApiErrorMessage(data, xhr.status, `Upload failed (${xhr.status}).`)), {
        status: xhr.status,
        data,
      }));
    });

    xhr.addEventListener('error', () => {
      release();
      reject(new Error('Network error during upload.'));
    });
    xhr.addEventListener('timeout', () => {
      xhr.abort();
      release();
      reject(new Error('Upload timed out. Try a smaller image or retry.'));
    });
    xhr.addEventListener('abort', () => {
      release();
      reject(new Error('Upload was cancelled.'));
    });
    xhr.send(formData);
  });
}

export const laravelAdminHomepage = {
  async fetchMediaHealth() {
    return authorizedJson('/admin/media/health');
  },

  async listHeroSlides(page = 1, perPage = 50) {
    const data = await authorizedJson(`/admin/hero-slides?page=${page}&perPage=${perPage}`);
    return normalizeListPayload(data);
  },

  async createHeroSlide(payload, options = {}) {
    return authorizedJson('/admin/hero-slides', {
      method: 'POST',
      body: JSON.stringify(payload),
      idempotencyKey: options.idempotencyKey,
    });
  },

  async updateHeroSlide(id, payload) {
    return authorizedJson(`/admin/hero-slides/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteHeroSlide(id) {
    return authorizedJson(`/admin/hero-slides/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  async uploadHeroImage(id, slot, file, { onProgress, idempotencyKey } = {}) {
    const form = new FormData();
    form.append('image', file);
    form.append('slot', slot);
    return uploadMultipart(
      `/admin/hero-slides/${encodeURIComponent(id)}/image`,
      form,
      onProgress,
      idempotencyKey,
      `hero:${id}:${slot}`
    );
  },

  async listBanners(page = 1, perPage = 50) {
    const data = await authorizedJson(`/admin/homepage-banners?page=${page}&perPage=${perPage}`);
    return normalizeListPayload(data);
  },

  async createBanner(payload, options = {}) {
    return authorizedJson('/admin/homepage-banners', {
      method: 'POST',
      body: JSON.stringify(payload),
      idempotencyKey: options.idempotencyKey,
    });
  },

  async updateBanner(id, payload) {
    return authorizedJson(`/admin/homepage-banners/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteBanner(id) {
    return authorizedJson(`/admin/homepage-banners/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  async uploadBannerImage(id, file, { onProgress, idempotencyKey } = {}) {
    const form = new FormData();
    form.append('image', file);
    return uploadMultipart(
      `/admin/homepage-banners/${encodeURIComponent(id)}/image`,
      form,
      onProgress,
      idempotencyKey,
      `banner:${id}`
    );
  },
};
