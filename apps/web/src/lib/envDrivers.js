/**
 * Vite driver flags: explicit env wins; production builds default to Laravel.
 * @param {string} envKey e.g. VITE_BACKEND_DRIVER
 */
export function readDriver(envKey) {
  const raw = (import.meta.env[envKey] ?? '').trim().toLowerCase();
  if (raw === 'laravel' || raw === 'pb') {
    return raw;
  }
  return import.meta.env.PROD ? 'laravel' : 'pb';
}

export function isLaravelDriver(envKey) {
  return readDriver(envKey) === 'laravel';
}
