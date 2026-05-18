import { adminUrl } from '@/lib/api/config.js';
import { getLaravelAdminToken } from '@/lib/api/auth.js';
import { ApiError } from '@/lib/api/errors.js';
import { fetchWithTimeout, ADMIN_JSON_TIMEOUT_MS } from '@/lib/api/http.js';
import { isHtmlResponse, parseApiErrorMessage, parseJsonBody } from '@/lib/api/parse.js';

const HTML_ERROR =
  'Admin API returned HTML instead of JSON. Check https://smartfashion.site/api/v1 Laravel bootstrap.';

/**
 * @param {string} adminPath path under /admin (e.g. /products)
 */
export function buildAdminUrl(adminPath) {
  return adminUrl(adminPath);
}

/**
 * @param {string} adminPath
 * @param {RequestInit & { idempotencyKey?: string }} [options]
 */
export async function adminJson(adminPath, options = {}) {
  const token = getLaravelAdminToken();
  if (!token) {
    throw new Error('Laravel admin token missing. Log out and log in again.');
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
    adminUrl(adminPath),
    { ...fetchOptions, headers },
    ADMIN_JSON_TIMEOUT_MS
  );

  const text = await response.text();
  const data = parseJsonBody(text);

  if (isHtmlResponse(response, text)) {
    throw new ApiError(HTML_ERROR, { status: response.status, html: true });
  }

  if (!response.ok) {
    throw new ApiError(parseApiErrorMessage(data, response.status, `Request failed (${response.status}).`), {
      status: response.status,
      data,
    });
  }

  return data;
}
