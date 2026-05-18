import {
  ADMIN_JSON_TIMEOUT_MS,
  ADMIN_UPLOAD_TIMEOUT_MS,
  fetchWithTimeout,
  parseApiErrorMessage,
} from '@/lib/adminHttp.js';
import {
  LARAVEL_ADMIN_TOKEN_KEY,
  resolveAdminApiBaseUrl,
} from '@/lib/adminMedia/config.js';
import {
  cacheLaravelMediaMeta,
  clearLaravelMediaMeta,
} from '@/lib/adminMedia/mediaCache.js';

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

/** Remove stale PocketBase/Railway session keys after Laravel login. */
export function clearLegacyPocketBaseAuth() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('pb_auth_smartfashion_hcgi');
    localStorage.removeItem('pocketbase_auth');
    sessionStorage.removeItem('pb_auth_smartfashion_hcgi');
    sessionStorage.removeItem('pocketbase_auth');
  } catch {
    /* ignore */
  }
}

function readXsrfToken() {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  if (!match?.[1]) return '';
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export async function loginLaravelAdmin(email, password) {
  await fetch(`${resolveAdminApiBaseUrl()}/sanctum/csrf-cookie`, {
    credentials: 'include',
  });

  const xsrfToken = readXsrfToken();
  const loginHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (xsrfToken) {
    loginHeaders['X-XSRF-TOKEN'] = xsrfToken;
  }

  const response = await fetchWithTimeout(
    apiUrl('/auth/login'),
    {
      method: 'POST',
      credentials: 'include',
      headers: loginHeaders,
      body: JSON.stringify({ identity: email, password }),
    },
    ADMIN_JSON_TIMEOUT_MS
  );

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

  const response = await fetchWithTimeout(
    apiUrl(path),
    {
      ...options,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    },
    ADMIN_JSON_TIMEOUT_MS
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = parseApiErrorMessage(
      data,
      response.status,
      `Request failed (${response.status}).`
    );
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

const inFlightUploads = new Set();

function uploadLockKey(kind, id) {
  return `${kind}:${id}`;
}

export async function deleteProductImage(productId) {
  const data = await authorizedFetch(
    `/admin/products/${encodeURIComponent(productId)}/image`,
    { method: 'DELETE' }
  );
  clearLaravelMediaMeta(productId);
  return data;
}

export async function deleteCategoryImage(categoryId) {
  const data = await authorizedFetch(
    `/admin/categories/${encodeURIComponent(categoryId)}/image`,
    { method: 'DELETE' }
  );
  clearLaravelMediaMeta(categoryId);
  return data;
}

export async function uploadProductImage(productId, file, { onProgress, idempotencyKey } = {}) {
  const lockKey = uploadLockKey('product-image', productId);
  if (inFlightUploads.has(lockKey)) {
    throw new Error('এই পণ্যের ছবি ইতিমধ্যে আপলোড হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।');
  }
  inFlightUploads.add(lockKey);

  const form = new FormData();
  form.append('image', file);

  const token = getLaravelAdminToken();
  try {
    const data = await uploadWithProgress(
      apiUrl(`/admin/products/${encodeURIComponent(productId)}/image`),
      form,
      token,
      onProgress,
      idempotencyKey
    );

    if (data?.record) {
      cacheLaravelMediaMeta(productId, data.record);
    }

    return data;
  } finally {
    inFlightUploads.delete(lockKey);
  }
}

export async function uploadCategoryImage(categoryId, file, { onProgress, idempotencyKey } = {}) {
  const lockKey = uploadLockKey('category-image', categoryId);
  if (inFlightUploads.has(lockKey)) {
    throw new Error('এই ক্যাটাগরির ছবি ইতিমধ্যে আপলোড হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।');
  }
  inFlightUploads.add(lockKey);

  const form = new FormData();
  form.append('image', file);

  const token = getLaravelAdminToken();
  try {
    const data = await uploadWithProgress(
      apiUrl(`/admin/categories/${encodeURIComponent(categoryId)}/image`),
      form,
      token,
      onProgress,
      idempotencyKey
    );

    if (data?.record) {
      cacheLaravelMediaMeta(categoryId, data.record);
    }

    return data;
  } finally {
    inFlightUploads.delete(lockKey);
  }
}

function uploadWithProgress(url, formData, token, onProgress, idempotencyKey) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.timeout = ADMIN_UPLOAD_TIMEOUT_MS;
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    if (idempotencyKey) {
      xhr.setRequestHeader('Idempotency-Key', idempotencyKey);
    }

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

      const message = parseApiErrorMessage(
        data,
        xhr.status,
        `Upload failed (${xhr.status}).`
      );
      const error = new Error(message);
      error.status = xhr.status;
      reject(error);
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload.'));
    });

    xhr.addEventListener('timeout', () => {
      xhr.abort();
      reject(
        new Error(
          'Upload timed out. Try a smaller image or wait a moment and retry.'
        )
      );
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload was cancelled.'));
    });

    xhr.send(formData);
  });
}
