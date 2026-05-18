/**
 * @param {unknown} payload
 */
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

export function parseApiErrorMessage(data, status, fallback = 'Request failed.') {
  if (data?.errors && typeof data.errors === 'object') {
    const first = Object.values(data.errors).flat().find(Boolean);
    if (first) {
      return String(first);
    }
  }

  if (data?.message) {
    const hint = data?.hint ? ` ${data.hint}` : '';
    return String(data.message) + hint;
  }

  if (status === 413) {
    return 'File is too large for the server. Try a smaller image.';
  }

  if (status >= 500) {
    return 'Server error. Check API uploads folder and PHP image extensions.';
  }

  return fallback;
}

/**
 * @param {Response} response
 * @param {string} bodyText
 */
export function isHtmlResponse(response, bodyText) {
  const contentType = response.headers.get('content-type') || '';
  const trimmed = bodyText.trim();
  return (
    contentType.includes('text/html') ||
    trimmed.startsWith('<!') ||
    trimmed.startsWith('<html')
  );
}

/**
 * @param {string} text
 */
export function parseJsonBody(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return {};
  }
  try {
    const data = JSON.parse(trimmed);
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}
