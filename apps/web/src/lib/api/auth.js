import { siteOriginUrl, v1Url } from '@/lib/api/config.js';
import { AUTH_PATHS, SANCTUM_CSRF } from '@/lib/api/endpoints.js';
import { fetchWithTimeout, ADMIN_JSON_TIMEOUT_MS } from '@/lib/api/http.js';
import { parseJsonBody } from '@/lib/api/parse.js';

export const LARAVEL_ADMIN_TOKEN_KEY = 'sf_laravel_admin_token_v1';

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

export async function ensureSanctumCsrf() {
  await fetch(`${siteOriginUrl()}${SANCTUM_CSRF}`, { credentials: 'include' });
}

export async function loginLaravelAdmin(email, password) {
  await ensureSanctumCsrf();

  const xsrfToken = readXsrfToken();
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (xsrfToken) {
    headers['X-XSRF-TOKEN'] = xsrfToken;
  }

  const response = await fetchWithTimeout(
    v1Url(AUTH_PATHS.login),
    {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({ identity: email, password }),
    },
    ADMIN_JSON_TIMEOUT_MS
  );

  const data = parseJsonBody(await response.text());

  if (!response.ok) {
    const message =
      data?.errors?.identity?.[0] || data?.message || 'Laravel admin login failed.';
    throw new Error(message);
  }

  const token = (data?.token ?? '').trim();
  if (!token) {
    throw new Error('Laravel admin login returned no token.');
  }

  setLaravelAdminToken(token);
  return token;
}
