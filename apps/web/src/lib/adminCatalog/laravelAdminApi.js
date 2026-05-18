import { buildAdminUrl, adminJson } from '@/lib/api/adminClient.js';
import { parseApiErrorMessage } from '@/lib/api/parse.js';

export function adminApiUrl(path) {
  return buildAdminUrl(path);
}

export function messageFromApiBody(data, fallback = 'Request failed.', status = 0) {
  return parseApiErrorMessage(data, status, fallback);
}

/**
 * @param {string} url Full admin API URL from adminApiUrl()
 * @param {Parameters<typeof adminJson>[1]} [options]
 */
export function adminAuthorizedJson(url, options = {}) {
  const parsed = new URL(url);
  const marker = '/admin';
  const idx = parsed.pathname.indexOf(marker);
  if (idx === -1) {
    throw new Error(`Invalid admin API URL: ${url}`);
  }
  const adminPath = `${parsed.pathname.slice(idx + marker.length)}${parsed.search}`;
  return adminJson(adminPath, options);
}
