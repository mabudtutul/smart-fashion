export const PUBLIC_JSON_TIMEOUT_MS = 30_000;
export const ADMIN_JSON_TIMEOUT_MS = 45_000;
export const ADMIN_UPLOAD_TIMEOUT_MS = 120_000;

export async function fetchWithTimeout(url, options = {}, timeoutMs = ADMIN_JSON_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
