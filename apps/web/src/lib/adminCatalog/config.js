/** @typedef {'pb' | 'laravel'} AdminCatalogDriver */

/** @returns {AdminCatalogDriver} */
export function getAdminCatalogDriver() {
  const raw = (import.meta.env.VITE_ADMIN_CATALOG_DRIVER ?? 'pb').trim().toLowerCase();
  return raw === 'laravel' ? 'laravel' : 'pb';
}

export function isLaravelAdminCatalog() {
  return getAdminCatalogDriver() === 'laravel';
}
