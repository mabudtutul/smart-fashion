import { ADMIN_JSON_TIMEOUT_MS, fetchWithTimeout, parseApiErrorMessage } from '@/lib/adminHttp.js';
import { getLaravelAdminToken } from '@/lib/adminMedia/laravelAdminMedia.js';
import { resolveApiV1Base } from '@/lib/catalog/config.js';

export function adminApiUrl(path) {
  return new URL(`/admin${path}`, `${resolveApiV1Base()}/`).toString();
}

export function messageFromApiBody(data, fallback = 'Request failed.', status = 0) {
  return parseApiErrorMessage(data, status, fallback);
}

export async function adminAuthorizedJson(url, options = {}) {
  const token = getLaravelAdminToken();
  if (!token) {
    throw new Error('Laravel admin token missing. Log out and log in again.');
  }

  const { idempotencyKey, headers: extraHeaders, ...fetchOptions } = options;
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(extraHeaders || {}),
  };
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }

  const response = await fetchWithTimeout(
    url,
    {
      ...fetchOptions,
      headers,
    },
    ADMIN_JSON_TIMEOUT_MS
  );

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
    const error = new Error(
      messageFromApiBody(data, `Request failed (${response.status}).`, response.status)
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
