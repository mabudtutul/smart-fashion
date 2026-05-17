import {
  LARAVEL_ADMIN_TOKEN_KEY,
  resolveAdminApiBaseUrl,
} from '@/lib/adminMedia/config.js';
import { cacheLaravelMediaMeta } from '@/lib/adminMedia/mediaCache.js';

function apiUrl(path) {
  return `${resolveAdminApiBaseUrl()}/api/v1${path}`;
}

export function getLaravelAdminToken() {
  return (localStorage.getItem(LARAVEL_ADMIN_TOKEN_KEY) ?? '').trim();
}

export function setLaravelAdminToken(token) {
  if (token) {
    localStorage.setItem(LARAVEL_ADMIN_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(LARAVEL_ADMIN_TOKEN_KEY);
  }
}

export async function loginLaravelAdmin(email, password) {
  const response = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.errors?.identity?.[0] ||
      data?.message ||
      'Laravel admin login failed.';
    throw new Error(message);
  }

  const token = (data?.token ?? '').trim();
  if (!token) {
    throw new Error('Laravel admin login returned no token.');
  }

  setLaravelAdminToken(token);
  return token;
}

async function authorizedFetch(path, options = {}) {
  const token = getLaravelAdminToken();
  if (!token) {
    throw new Error('Laravel admin token missing. Log out and log in again.');
  }

  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.message ||
      data?.errors?.image?.[0] ||
      `Request failed (${response.status}).`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function syncProductToLaravel(product) {
  await authorizedFetch(`/admin/products/${encodeURIComponent(product.id)}/sync`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      category: product.category,
      stock: product.stock ?? null,
      discount: product.discount ?? null,
      featured: Boolean(product.featured),
      bestseller: Boolean(product.bestseller),
      new: Boolean(product.new),
    }),
  });
}

export async function syncCategoryToLaravel(category) {
  await authorizedFetch(`/admin/categories/${encodeURIComponent(category.id)}/sync`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: category.name,
      description: category.description ?? '',
    }),
  });
}

export async function uploadProductImage(productId, file, { onProgress } = {}) {
  const form = new FormData();
  form.append('image', file);

  const token = getLaravelAdminToken();
  const data = await uploadWithProgress(
    apiUrl(`/admin/products/${encodeURIComponent(productId)}/image`),
    form,
    token,
    onProgress
  );

  if (data?.record) {
    cacheLaravelMediaMeta(productId, data.record);
  }

  return data;
}

export async function uploadCategoryImage(categoryId, file, { onProgress } = {}) {
  const form = new FormData();
  form.append('image', file);

  const token = getLaravelAdminToken();
  const data = await uploadWithProgress(
    apiUrl(`/admin/categories/${encodeURIComponent(categoryId)}/image`),
    form,
    token,
    onProgress
  );

  if (data?.record) {
    cacheLaravelMediaMeta(categoryId, data.record);
  }

  return data;
}

function uploadWithProgress(url, formData, token, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

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

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
        return;
      }

      const message =
        data?.message ||
        data?.errors?.image?.[0] ||
        `Upload failed (${xhr.status}).`;
      const error = new Error(message);
      error.status = xhr.status;
      reject(error);
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload.'));
    });

    xhr.send(formData);
  });
}
