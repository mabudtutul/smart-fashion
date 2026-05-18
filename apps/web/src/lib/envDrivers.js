/**
 * Laravel-only driver resolution (PocketBase driver removed Phase 2).
 * @param {string} envKey e.g. VITE_BACKEND_DRIVER
 */
export function readDriver(envKey) {
  const raw = (import.meta.env[envKey] ?? '').trim().toLowerCase();
  if (raw === 'pb' && import.meta.env.DEV) {
    console.warn(`[SmartFashion] ${envKey}=pb is no longer supported; using laravel.`);
  }
  return 'laravel';
}

export function isLaravelDriver(envKey) {
  return readDriver(envKey) === 'laravel';
}
