import PocketBase, { BaseAuthStore } from 'pocketbase';

const POCKETBASE_API_URL = '/hcgi/platform';
export const PB_AUTH_STORAGE_KEY = 'pb_auth_smartfashion_hcgi';

export const pbAuthStore = new BaseAuthStore();
const pb = new PocketBase(POCKETBASE_API_URL, pbAuthStore);

if (typeof window !== 'undefined') {
  window.__SMARTFASHION_PB__ = pb;
}

console.log('PB INSTANCE pocketbaseClient.js', pb);
if (typeof window !== 'undefined') {
  console.log(
    '[SmartFashion auth] singleton pocketbaseClient',
    pb === window.__SMARTFASHION_PB__
  );
}

function isAuthRecord(value) {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    (value.collectionId || value.collectionName)
  );
}

const AUTH_ENDPOINT_RE = /\/auth-(with-password|refresh)(?:\?|$)/i;
const JWT_RE = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/;

/** Read token only from explicit auth fields — never from record.id/email. */
function readTokenFromPayload(payload) {
  if (!payload || typeof payload !== 'object') return '';

  const candidates = [
    payload.token,
    payload.accessToken,
    payload.access_token,
    payload.auth_token,
    payload.sessionToken,
    payload.session_token,
    payload.jwt,
    payload.authToken,
    payload.data?.token,
    payload.data?.accessToken,
    payload.data?.access_token,
    payload.auth?.token,
    payload.meta?.token,
    payload.result?.token,
    payload.result?.accessToken,
  ];

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim().length > 10) {
      return value.trim();
    }
  }

  return '';
}

function readAuthTokenFromHeaders(response) {
  if (!response?.headers?.get) return '';
  const names = ['Authorization', 'authorization', 'X-Auth-Token', 'x-auth-token'];
  for (const name of names) {
    const raw = response.headers.get(name);
    if (typeof raw === 'string' && raw.trim()) {
      return raw.replace(/^Bearer\s+/i, '').trim();
    }
  }
  return '';
}

function extractJwtFromText(text) {
  if (typeof text !== 'string' || !text) return '';
  const match = text.match(JWT_RE);
  return match ? match[0] : '';
}

function readTokenFromPayloadDeep(payload, depth = 0) {
  if (!payload || depth > 6) return '';
  if (typeof payload === 'string') {
    const direct = payload.trim();
    if (direct.split('.').length === 3 && direct.length > 20) return direct;
    return extractJwtFromText(direct);
  }
  if (typeof payload !== 'object') return '';

  const shallow = readTokenFromPayload(payload);
  if (shallow) return shallow;

  for (const value of Object.values(payload)) {
    const found = readTokenFromPayloadDeep(value, depth + 1);
    if (found) return found;
  }
  return '';
}

function stashCapturedAuthToken(token, rawPayload) {
  if (typeof window === 'undefined' || !token) return;
  window.__SMARTFASHION_LAST_AUTH_TOKEN__ = token;
  if (rawPayload && typeof rawPayload === 'object') {
    window.__SMARTFASHION_RAW_AUTH_RESPONSE__ = rawPayload;
  }
}

export function getCapturedAuthToken() {
  if (typeof window === 'undefined') return '';
  return (window.__SMARTFASHION_LAST_AUTH_TOKEN__ || '').trim();
}

async function captureAuthFromRawResponse(response, requestUrl) {
  const url = String(requestUrl || '');
  if (!AUTH_ENDPOINT_RE.test(url)) return;

  let rawText = '';
  let payload = null;

  try {
    rawText = await response.clone().text();
  } catch {
    /* body already consumed */
  }

  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch {
      payload = null;
    }
    if (payload && typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        payload = null;
      }
    }
    if (payload && typeof payload === 'object') {
      if (typeof window !== 'undefined') {
        window.__SMARTFASHION_RAW_AUTH_RESPONSE__ = payload;
      }
    }
  }

  const headerToken = readAuthTokenFromHeaders(response);
  const bodyToken =
    readTokenFromPayload(payload) ||
    readTokenFromPayloadDeep(payload) ||
    extractJwtFromText(rawText);
  const token = (headerToken || bodyToken).trim();

  if (token) {
    stashCapturedAuthToken(token, payload);
  }
}

function installRawAuthFetchCapture(client) {
  if (typeof fetch === 'undefined') return;
  const nativeFetch = fetch.bind(globalThis);

  client.beforeSend = (url, options) => {
    const sendOptions = options || {};
    const upstreamFetch = sendOptions.fetch || nativeFetch;

    sendOptions.fetch = async (requestUrl, init) => {
      const response = await upstreamFetch(requestUrl, init);
      try {
        await captureAuthFromRawResponse(response, requestUrl);
      } catch {
        /* non-fatal */
      }
      return response;
    };

    return { url, options: sendOptions };
  };
}

installRawAuthFetchCapture(pb);

pb.afterSend = (response, data) => {
  if (data && typeof data === 'object' && typeof window !== 'undefined') {
    window.__SMARTFASHION_RAW_AUTH_RESPONSE__ = data;
  }

  const headerToken = readAuthTokenFromHeaders(response);
  const bodyToken = readTokenFromPayload(data) || readTokenFromPayloadDeep(data);
  const captured =
    typeof window !== 'undefined' ? getCapturedAuthToken() : '';
  const token = (captured || headerToken || bodyToken).trim();

  if (token) {
    stashCapturedAuthToken(token, data);
    if (data && typeof data === 'object' && !readTokenFromPayload(data)) {
      data.token = token;
    }
  }

  return data;
};

function safeCloneRecord(model) {
  if (!model) return null;
  try {
    return JSON.parse(JSON.stringify(model));
  } catch {
    return {
      id: model.id,
      collectionId: model.collectionId,
      collectionName: model.collectionName,
      email: model.email,
    };
  }
}

function migrateLegacyAuthKey() {
  if (typeof window === 'undefined') return;
  try {
    const legacy = window.localStorage.getItem('pocketbase_auth');
    if (legacy && !window.localStorage.getItem(PB_AUTH_STORAGE_KEY)) {
      window.localStorage.setItem(PB_AUTH_STORAGE_KEY, legacy);
    }
  } catch {
    /* blocked */
  }
}

export function readPersistedAuthRaw() {
  if (typeof window === 'undefined') return null;
  try {
    return (
      window.localStorage.getItem(PB_AUTH_STORAGE_KEY) ||
      window.sessionStorage.getItem(PB_AUTH_STORAGE_KEY) ||
      window.localStorage.getItem('pocketbase_auth')
    );
  } catch {
    return null;
  }
}

/** Normalize PocketBase / HCGI auth-with-password payload → { token, model }. */
export function extractAuthSession(authData) {
  const raw =
    authData ??
    (typeof window !== 'undefined' ? window.__SMARTFASHION_RAW_AUTH_RESPONSE__ : null);

  let token = readTokenFromPayload(raw) || readTokenFromPayloadDeep(raw);
  let model = null;

  if (raw && typeof raw === 'object') {
    if (typeof raw.token === 'string' && raw.token.trim()) {
      token = raw.token.trim();
      model = raw.record ?? raw.model ?? null;
    } else if (raw.data && typeof raw.data === 'object') {
      return extractAuthSession(raw.data);
    } else if (isAuthRecord(raw)) {
      model = raw;
    } else {
      model = raw.record ?? raw.model ?? null;
    }
  }

  if (!token) {
    token = getCapturedAuthToken();
  }

  if (!token) {
    token = (pb.authStore.token || '').trim();
  }

  return {
    token,
    model: safeCloneRecord(model ?? pb.authStore.record ?? pb.authStore.model),
  };
}

function isJwtToken(token) {
  return typeof token === 'string' && token.split('.').length === 3;
}

export function isAuthSessionValid(token) {
  if (!token) return false;
  syncPocketBaseAuthFromStorage();
  if (isJwtToken(token)) {
    return pb.authStore.isValid === true;
  }
  return token.length > 10;
}

export async function ensureStorageAccess() {
  if (typeof document === 'undefined' || !document.requestStorageAccess) return;
  try {
    await document.requestStorageAccess();
  } catch {
    /* ignore */
  }
}

export function forcePersistAuthAfterLogin(token, model) {
  const sessionToken = typeof token === 'string' ? token.trim() : '';
  if (typeof window === 'undefined' || !sessionToken) {
    console.error('[SmartFashion auth] forcePersist: missing token');
    return false;
  }

  const record = safeCloneRecord(model);
  const envelope = JSON.stringify({ token: sessionToken, record });

  console.log('[SmartFashion auth] BEFORE SAVE', pb.authStore);

  try {
    window.localStorage.setItem(PB_AUTH_STORAGE_KEY, envelope);
  } catch (err) {
    console.error('[SmartFashion auth] localStorage.setItem failed', err);
    return false;
  }

  console.log(
    '[SmartFashion auth] LOCALSTORAGE AFTER MANUAL SET',
    window.localStorage.getItem(PB_AUTH_STORAGE_KEY)
  );

  pb.authStore.save(sessionToken, record);

  console.log('[SmartFashion auth] AFTER SAVE', pb.authStore);
  console.log(
    '[SmartFashion auth] LOCALSTORAGE AFTER SAVE',
    window.localStorage.getItem(PB_AUTH_STORAGE_KEY)
  );

  const readBack = readPersistedAuthRaw();
  if (!readBack) return false;

  try {
    const parsed = JSON.parse(readBack);
    return parsed?.token === sessionToken && Boolean(pb.authStore.token);
  } catch {
    return false;
  }
}

export function syncPocketBaseAuthFromStorage() {
  if (typeof window === 'undefined') return;
  try {
    const raw = readPersistedAuthRaw();
    if (!raw) return;
    const data = JSON.parse(raw);
    const token = data?.token;
    const model = data?.record || data?.model || null;
    if (token) {
      pb.authStore.save(token, model);
    }
  } catch {
    /* ignore */
  }
}

export function clearInvalidPersistedAuth() {
  if (typeof window === 'undefined') return;
  try {
    const raw = readPersistedAuthRaw();
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed?.token) {
      clearPersistedAuth();
    }
  } catch {
    clearPersistedAuth();
  }
}

export function hasLocalStorageAuthKey() {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(PB_AUTH_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed?.token);
  } catch {
    return false;
  }
}

export function canRedirectToAdminProducts() {
  if (typeof window === 'undefined') return false;
  if (!hasLocalStorageAuthKey()) return false;

  const raw = readPersistedAuthRaw();
  if (!raw) return false;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return false;
  }

  const token = parsed?.token;
  if (!token) return false;

  syncPocketBaseAuthFromStorage();
  return isAuthSessionValid(token);
}

export function initializePocketBaseAuth() {
  if (typeof window === 'undefined') return;
  migrateLegacyAuthKey();
  clearInvalidPersistedAuth();
  if (readPersistedAuthRaw()) {
    syncPocketBaseAuthFromStorage();
  }
}

export function clearPersistedAuth() {
  pb.authStore.clear();
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(PB_AUTH_STORAGE_KEY);
    window.sessionStorage.removeItem(PB_AUTH_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export default pb;

export { pb, pb as pocketbaseClient };
