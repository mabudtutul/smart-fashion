import { useSyncExternalStore } from 'react';
import { clearAdminMediaSession, ensureLaravelMediaAuth } from '@/lib/adminMedia/index.js';
import pb, {
  canRedirectToAdminProducts,
  clearAuthEndpointHtmlFlag,
  clearPersistedAuth,
  didAuthEndpointReturnHtml,
  ensureStorageAccess,
  extractAuthSession,
  forcePersistAuthAfterLogin,
  getCapturedAuthToken,
  hasLocalStorageAuthKey,
} from '@/lib/pocketbaseClient.js';

console.log('PB INSTANCE adminAuth.js', pb);
if (typeof window !== 'undefined') {
  console.log(
    '[SmartFashion auth] singleton adminAuth',
    pb === window.__SMARTFASHION_PB__
  );
}

/** Authenticate for admin CRUD (users collection first, then superuser). */
export async function adminLogin(email, password) {
  await ensureStorageAccess();
  clearAuthEndpointHtmlFlag();

  const collections = ['users', '_superusers'];
  let lastError;
  let authData;
  let authedCollection;

  for (const collection of collections) {
    try {
      authData = await pb.collection(collection).authWithPassword(email, password);
      authedCollection = collection;
      console.log('[SmartFashion auth] RAW authWithPassword', collection, authData);
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!authData) {
    throw lastError || new Error('Invalid login credentials.');
  }

  let { token, model } = extractAuthSession(authData);
  token = token || getCapturedAuthToken();

  if (!token && authedCollection) {
    try {
      const refreshed = await pb.collection(authedCollection).authRefresh();
      console.log('[SmartFashion auth] RAW authRefresh', refreshed);
      const refreshedSession = extractAuthSession(refreshed);
      token = refreshedSession.token || getCapturedAuthToken() || token;
      model = refreshedSession.model ?? model;
    } catch (err) {
      console.warn('[SmartFashion auth] authRefresh after login failed', err);
    }
  }

  const sessionToken = (token || getCapturedAuthToken() || pb.authStore.token || '').trim();
  const sessionModel =
    model ?? pb.authStore.record ?? pb.authStore.model ?? null;

  console.log('[SmartFashion auth] sessionToken length', sessionToken.length);

  if (!sessionToken) {
    if (didAuthEndpointReturnHtml()) {
      throw new Error(
        'Auth API returned HTML instead of JSON. Set VITE_POCKETBASE_URL to your external PocketBase host.'
      );
    }
    console.error('[SmartFashion auth] no token in response', {
      authData,
      raw: window.__SMARTFASHION_RAW_AUTH_RESPONSE__,
      captured: getCapturedAuthToken(),
      storeToken: pb.authStore.token,
    });
    throw new Error('Login succeeded but auth was not persisted.');
  }

  if (!pb.authStore.token) {
    pb.authStore.save(sessionToken, sessionModel);
  }

  if (!forcePersistAuthAfterLogin(sessionToken, sessionModel)) {
    throw new Error('Login succeeded but auth was not persisted.');
  }

  if (!hasLocalStorageAuthKey() || !canRedirectToAdminProducts()) {
    throw new Error('Login succeeded but auth was not persisted.');
  }

  try {
    await ensureLaravelMediaAuth(email, password);
  } catch (err) {
    console.warn('[SmartFashion] Laravel media auth bridge failed', err);
  }

  return true;
}

export function adminLogout() {
  clearPersistedAuth();
  clearAdminMediaSession();
}

export function isAdminAuthenticated() {
  return canRedirectToAdminProducts();
}

export function isUsersCollectionAuth() {
  return pb.authStore.record?.collectionName === 'users';
}

export async function requestPasswordReset(email) {
  const url = `${window.location.origin}/admin/reset-password?token={TOKEN}`;
  await pb.collection('users').requestPasswordReset(email.trim(), { url });
}

export async function confirmPasswordReset(token, password, passwordConfirm) {
  await pb.collection('users').confirmPasswordReset(token, password, passwordConfirm);
}

export async function changeAdminPassword(oldPassword, password, passwordConfirm) {
  const id = pb.authStore.record?.id;
  if (!id || !isUsersCollectionAuth()) {
    throw new Error('Password change is only available for user accounts.');
  }
  await pb.collection('users').update(id, {
    oldPassword,
    password,
    passwordConfirm,
  });
}

export function useAdminAuth() {
  return useSyncExternalStore(
    (onStoreChange) => pb.authStore.onChange(onStoreChange),
    () => isAdminAuthenticated(),
    () => false
  );
}
