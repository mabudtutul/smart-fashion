import { useSyncExternalStore } from 'react';
import { isLaravelAdminAuth } from '@/lib/backendConfig.js';
import { notifyAdminAuthChange, subscribeAdminAuth } from '@/lib/adminAuthStore.js';
import { clearAdminMediaSession, ensureLaravelMediaAuth } from '@/lib/adminMedia/index.js';
import {
  getLaravelAdminToken,
  loginLaravelAdmin,
} from '@/lib/adminMedia/laravelAdminMedia.js';
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
  isPocketBaseConfigured,
} from '@/lib/pocketbaseClient.js';

/** Authenticate for admin CRUD — Laravel Sanctum or PocketBase legacy. */
export async function adminLogin(email, password) {
  if (isLaravelAdminAuth()) {
    await loginLaravelAdmin(email, password);
    notifyAdminAuthChange();
    return true;
  }

  if (!isPocketBaseConfigured()) {
    throw new Error('PocketBase is not configured. Set VITE_POCKETBASE_URL or use Laravel admin drivers.');
  }

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
      const refreshedSession = extractAuthSession(refreshed);
      token = refreshedSession.token || getCapturedAuthToken() || token;
      model = refreshedSession.model ?? model;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('[SmartFashion auth] authRefresh after login failed', err);
      }
    }
  }

  const sessionToken = (token || getCapturedAuthToken() || pb.authStore.token || '').trim();
  const sessionModel =
    model ?? pb.authStore.record ?? pb.authStore.model ?? null;

  if (!sessionToken) {
    if (didAuthEndpointReturnHtml()) {
      throw new Error(
        'Auth API returned HTML instead of JSON. Set VITE_POCKETBASE_URL to your external PocketBase host.'
      );
    }
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
    if (import.meta.env.DEV) {
      console.warn('[SmartFashion] Laravel media auth bridge failed', err);
    }
  }

  notifyAdminAuthChange();
  return true;
}

export function adminLogout() {
  if (isLaravelAdminAuth()) {
    clearAdminMediaSession();
    notifyAdminAuthChange();
    return;
  }

  clearPersistedAuth();
  clearAdminMediaSession();
  notifyAdminAuthChange();
}

export function isAdminAuthenticated() {
  if (isLaravelAdminAuth()) {
    return Boolean(getLaravelAdminToken());
  }

  return canRedirectToAdminProducts();
}

export function isUsersCollectionAuth() {
  if (isLaravelAdminAuth()) {
    return true;
  }

  return pb.authStore.record?.collectionName === 'users';
}

export async function requestPasswordReset(email) {
  if (isLaravelAdminAuth()) {
    throw new Error('Password reset is not available for Laravel admin yet.');
  }

  const url = `${window.location.origin}/admin/reset-password?token={TOKEN}`;
  await pb.collection('users').requestPasswordReset(email.trim(), { url });
}

export async function confirmPasswordReset(token, password, passwordConfirm) {
  if (isLaravelAdminAuth()) {
    throw new Error('Password reset is not available for Laravel admin yet.');
  }

  await pb.collection('users').confirmPasswordReset(token, password, passwordConfirm);
}

export async function changeAdminPassword(oldPassword, password, passwordConfirm) {
  if (isLaravelAdminAuth()) {
    throw new Error('Password change is not available for Laravel admin yet.');
  }

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

function getAdminAuthSnapshot() {
  return isAdminAuthenticated();
}

export function useAdminAuth() {
  if (isLaravelAdminAuth()) {
    return useSyncExternalStore(subscribeAdminAuth, getAdminAuthSnapshot, () => false);
  }

  return useSyncExternalStore(
    (onStoreChange) => pb.authStore.onChange(onStoreChange),
    getAdminAuthSnapshot,
    () => false
  );
}
