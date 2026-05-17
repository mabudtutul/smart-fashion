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

/** Read token only from explicit auth fields — never from record.id/email. */
function readTokenFromPayload(payload) {
  if (!payload || typeof payload !== 'object') return '';

  const candidates = [
    payload.token,
    payload.accessToken,
    payload.access_token,
    payload.jwt,
    payload.authToken,
    payload.data?.token,
    payload.data?.accessToken,
    payload.auth?.token,
    payload.meta?.token,
  ];

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim().length > 10) {
      return value.trim();
    }
  }

  return '';
}

pb.afterSend = (response, data) => {
  if (data && typeof data === 'object') {
    window.__SMARTFASHION_RAW_AUTH_RESPONSE__ = data;
  }

  const headerToken =
    response?.headers?.get?.('Authorization')?.replace(/^Bearer\s+/i, '') ||
    response?.headers?.get?.('X-Auth-Token') ||
    response?.headers?.get?.('x-auth-token') ||
    '';

  const bodyToken = readTokenFromPayload(data);
  const token = (headerToken || bodyToken).trim();

  if (token && typeof window !== 'undefined') {
    window.__SMARTFASHION_LAST_AUTH_TOKEN__ = token;
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

  let token = readTokenFromPayload(raw);
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

  if (!token && typeof window !== 'undefined') {
    token = (window.__SMARTFASHION_LAST_AUTH_TOKEN__ || '').trim();
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
