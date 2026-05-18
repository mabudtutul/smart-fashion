import { v1Url } from '@/lib/api/config.js';
import { ApiError } from '@/lib/api/errors.js';
import { fetchWithTimeout, PUBLIC_JSON_TIMEOUT_MS } from '@/lib/api/http.js';
import { isHtmlResponse, parseApiErrorMessage, parseJsonBody } from '@/lib/api/parse.js';

const HTML_ERROR =
  'API returned HTML instead of JSON. Verify https://smartfashion.site/api/v1 routes to Laravel public_html/api.';

/**
 * @param {string} path e.g. /categories
 * @param {Record<string, string | number | boolean | undefined | null>} [query]
 */
export async function getPublicJson(path, query = {}) {
  const url = v1Url(path, query);
  const response = await fetchWithTimeout(
    url,
    { headers: { Accept: 'application/json' } },
    PUBLIC_JSON_TIMEOUT_MS
  );

  const text = await response.text();
  const data = parseJsonBody(text);

  if (isHtmlResponse(response, text) || (response.ok && !text.trim())) {
    throw new ApiError(HTML_ERROR, { status: response.status, html: true });
  }

  if (!response.ok) {
    throw new ApiError(parseApiErrorMessage(data, response.status, `API error (${response.status})`), {
      status: response.status,
      data,
    });
  }

  return data;
}
