import { useSyncExternalStore } from 'react';
import { isLaravelAdminAuth } from '@/lib/backendConfig.js';
import { notifyAdminAuthChange, subscribeAdminAuth } from '@/lib/adminAuthStore.js';
import { clearAdminMediaSession } from '@/lib/adminMedia/index.js';
import {
  clearLegacyPocketBaseAuth,
  getLaravelAdminToken,
  loginLaravelAdmin,
} from '@/lib/adminMedia/laravelAdminMedia.js';

/** Authenticate admin against Laravel Sanctum (production) or legacy PocketBase. */
export async function adminLogin(email, password) {
  if (isLaravelAdminAuth()) {
    clearLegacyPocketBaseAuth();
    await loginLaravelAdmin(email, password);
    notifyAdminAuthChange();
    return true;
  }

  const pocketbase = await import('@/lib/pocketbaseClient.js');
  const {
    default: pb,
    canRedirectToAdminProducts,
    clearAuthEndpointHtmlFlag,
    didAuthEndpointReturnHtml,
    ensureStorageAccess,
    extractAuthSession,
    forcePersistAuthAfterLogin,
    getCapturedAuthToken,
    hasLocalStorageAuthKey,
    isPocketBaseConfigured,
  } = pocketbase;

  if (!isPocketBaseConfigured()) {
    throw new Error('PocketBase is not configured. Set Laravel admin drivers or VITE_POCKETBASE_URL.');
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
    } catch {
      /* ignore */
    }
  }

  const sessionToken = (token || getCapturedAuthToken() || pb.authStore.token || '').trim();
  const sessionModel = model ?? pb.authStore.record ?? pb.authStore.model ?? null;

  if (!sessionToken) {
    if (didAuthEndpointReturnHtml()) {
      throw new Error('Auth API returned HTML instead of JSON. Check VITE_POCKETBASE_URL.');
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

  notifyAdminAuthChange();
  return true;
}

export function adminLogout() {
  if (isLaravelAdminAuth()) {
    clearAdminMediaSession();
    clearLegacyPocketBaseAuth();
    notifyAdminAuthChange();
    return;
  }

  import('@/lib/pocketbaseClient.js').then(({ clearPersistedAuth }) => {
    clearPersistedAuth();
    clearAdminMediaSession();
    notifyAdminAuthChange();
  });
}

export function isAdminAuthenticated() {
  if (isLaravelAdminAuth()) {
    return Boolean(getLaravelAdminToken());
  }

  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const raw =
      window.localStorage.getItem('pb_auth_smartfashion_hcgi') ||
      window.localStorage.getItem('pocketbase_auth');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed?.token);
  } catch {
    return false;
  }
}

export async function isAdminAuthenticatedAsync() {
  if (isLaravelAdminAuth()) {
    return Boolean(getLaravelAdminToken());
  }

  const { canRedirectToAdminProducts } = await import('@/lib/pocketbaseClient.js');
  return canRedirectToAdminProducts();
}

export function isUsersCollectionAuth() {
  return isLaravelAdminAuth();
}

export async function requestPasswordReset(email) {
  if (isLaravelAdminAuth()) {
    throw new Error('Password reset is not available yet. Contact your site administrator.');
  }

  const { default: pb } = await import('@/lib/pocketbaseClient.js');
  const url = `${window.location.origin}/admin/reset-password?token={TOKEN}`;
  await pb.collection('users').requestPasswordReset(email.trim(), { url });
}

export async function confirmPasswordReset(token, password, passwordConfirm) {
  if (isLaravelAdminAuth()) {
    throw new Error('Password reset is not available yet.');
  }

  const { default: pb } = await import('@/lib/pocketbaseClient.js');
  await pb.collection('users').confirmPasswordReset(token, password, passwordConfirm);
}

export async function changeAdminPassword(oldPassword, password, passwordConfirm) {
  if (isLaravelAdminAuth()) {
    throw new Error('Password change via the dashboard is not available yet. Use Hostinger or artisan.');
  }

  const { default: pb } = await import('@/lib/pocketbaseClient.js');
  const id = pb.authStore.record?.id;
  if (!id || pb.authStore.record?.collectionName !== 'users') {
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
  return useSyncExternalStore(subscribeAdminAuth, getAdminAuthSnapshot, () => false);
}
