import { useSyncExternalStore } from 'react';
import { notifyAdminAuthChange, subscribeAdminAuth } from '@/lib/adminAuthStore.js';
import { clearAdminMediaSession } from '@/lib/adminMedia/index.js';
import {
  clearLegacyPocketBaseAuth,
  getLaravelAdminToken,
  loginLaravelAdmin,
} from '@/lib/adminMedia/laravelAdminMedia.js';

export async function adminLogin(email, password) {
  clearLegacyPocketBaseAuth();
  await loginLaravelAdmin(email, password);
  notifyAdminAuthChange();
  return true;
}

export function adminLogout() {
  clearAdminMediaSession();
  clearLegacyPocketBaseAuth();
  notifyAdminAuthChange();
}

export function isAdminAuthenticated() {
  return Boolean(getLaravelAdminToken());
}

export async function isAdminAuthenticatedAsync() {
  return Boolean(getLaravelAdminToken());
}

export function isUsersCollectionAuth() {
  return true;
}

export async function requestPasswordReset() {
  throw new Error('Password reset is not available yet. Contact your site administrator.');
}

export async function confirmPasswordReset() {
  throw new Error('Password reset is not available yet.');
}

export async function changeAdminPassword() {
  throw new Error(
    'Password change via the dashboard is not available yet. Use Hostinger or artisan.'
  );
}

function getAdminAuthSnapshot() {
  return isAdminAuthenticated();
}

export function useAdminAuth() {
  return useSyncExternalStore(subscribeAdminAuth, getAdminAuthSnapshot, () => false);
}
