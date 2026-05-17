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

  const text = await response.text();
  const trimmed = text.trim();
  let data = {};
  if (trimmed) {
    try {
      data = JSON.parse(trimmed);
    } catch {
      data = {};
    }
  }

  const looksHtml =
    (response.headers.get('content-type') || '').includes('text/html') ||
    trimmed.startsWith('<!') ||
    trimmed.startsWith('<html');

  if (looksHtml || (response.ok && typeof data !== 'object')) {
    const error = new Error(
      'Admin API returned HTML instead of JSON. Check api.smartfashion.site Laravel bootstrap.'
    );
    error.status = response.status;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(messageFromApiBody(data, `Request failed (${response.status}).`));
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
