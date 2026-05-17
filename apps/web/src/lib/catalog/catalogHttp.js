export class CatalogApiError extends Error {
  constructor(message, { status, html = false, data = null } = {}) {
    super(message);
    this.name = 'CatalogApiError';
    this.status = status;
    this.html = html;
    this.data = data;
  }
}

export function isCatalogApiError(error) {
  return error instanceof CatalogApiError;
}

export function catalogErrorMessage(error, fallback = 'Could not load catalog.') {
  if (isCatalogApiError(error)) {
    return error.message;
  }
  if (error?.message) {
    return String(error.message);
  }
  return fallback;
}

/**
 * @param {string} url
 * @returns {Promise<Record<string, unknown>>}
 */
export async function fetchCatalogJson(url) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  const contentType = response.headers.get('content-type') || '';
  const text = await response.text();
  const trimmed = text.trim();

  let data = null;
  if (trimmed) {
    try {
      data = JSON.parse(trimmed);
    } catch {
      data = null;
    }
  }

  const looksHtml =
    contentType.includes('text/html') ||
    trimmed.startsWith('<!') ||
    trimmed.startsWith('<html');

  if (looksHtml || (response.ok && (!data || typeof data !== 'object'))) {
    throw new CatalogApiError(
      'Catalog API returned HTML instead of JSON. Verify api.smartfashion.site points to Laravel public_html (index.php + .htaccess).',
      { status: response.status, html: true }
    );
  }

  if (!response.ok) {
    const message =
      data?.message ||
      (data?.errors && Object.values(data.errors).flat().find(Boolean)) ||
      `Catalog API error (${response.status})`;
    throw new CatalogApiError(String(message), { status: response.status, data });
  }

  return data;
}

/** @param {unknown} payload */
export function normalizeListPayload(payload) {
  if (payload && typeof payload === 'object' && Array.isArray(payload.items)) {
    return payload;
  }
  if (Array.isArray(payload)) {
    return {
      items: payload,
      page: 1,
      perPage: payload.length,
      totalItems: payload.length,
      totalPages: 1,
    };
  }
  return { items: [], page: 1, perPage: 0, totalItems: 0, totalPages: 0 };
}
