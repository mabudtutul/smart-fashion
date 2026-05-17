import { getLaravelAdminToken } from '@/lib/adminMedia/laravelAdminMedia.js';
import { resolveApiBaseUrl } from '@/lib/catalog/config.js';

export function adminApiUrl(path) {
  const base = resolveApiBaseUrl();
  return new URL(`/api/v1/admin${path}`, `${base}/`).toString();
}

export function messageFromApiBody(data, fallback = 'Request failed.') {
  if (data?.errors && typeof data.errors === 'object') {
    const first = Object.values(data.errors).flat().find(Boolean);
    if (first) return String(first);
  }
  if (data?.message) return String(data.message);
  return fallback;
}

export async function adminAuthorizedJson(url, options = {}) {
  const token = getLaravelAdminToken();
  if (!token) {
    throw new Error('Laravel admin token missing. Log out and log in again.');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(messageFromApiBody(data, `Request failed (${response.status}).`));
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
