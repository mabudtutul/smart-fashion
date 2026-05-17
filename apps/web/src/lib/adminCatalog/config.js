import { readDriver } from '@/lib/envDrivers.js';

/** @typedef {'pb' | 'laravel'} AdminCatalogDriver */

/** @returns {AdminCatalogDriver} */
export function getAdminCatalogDriver() {
  return readDriver('VITE_ADMIN_CATALOG_DRIVER');
}

export function isLaravelAdminCatalog() {
  return getAdminCatalogDriver() === 'laravel';
}
