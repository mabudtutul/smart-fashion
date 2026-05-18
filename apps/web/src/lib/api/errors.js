export class ApiError extends Error {
  constructor(message, { status = 0, html = false, data = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.html = html;
    this.data = data;
  }
}

export function isApiError(error) {
  return error instanceof ApiError;
}

export function apiErrorMessage(error, fallback = 'Request failed.') {
  if (isApiError(error)) {
    return error.message;
  }
  if (error?.message) {
    return String(error.message);
  }
  return fallback;
}
