import { isLaravelAdminCatalog } from '@/lib/adminCatalog/config.js';
import { isLaravelAdminMedia } from '@/lib/adminMedia/config.js';
import { isLaravelCatalog } from '@/lib/catalog/config.js';

/** Storefront + admin catalog/media all on Laravel API. */
export function isLaravelClientStack() {
  return isLaravelCatalog() && isLaravelAdminCatalog() && isLaravelAdminMedia();
}

/** Admin login/session via Sanctum (no PocketBase auth gate). */
export function isLaravelAdminAuth() {
  return isLaravelAdminCatalog() && isLaravelAdminMedia();
}

export function isPocketBaseUrlConfigured() {
  return Boolean((import.meta.env.VITE_POCKETBASE_URL ?? '').trim());
}

/** Blog still uses PocketBase when URL is configured. */
export function needsPocketBaseClient() {
  return isPocketBaseUrlConfigured();
}
