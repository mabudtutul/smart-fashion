import { getLaravelAdminToken } from '@/lib/api/auth.js';
import { adminJson } from '@/lib/api/adminClient.js';
import { adminUrl } from '@/lib/api/config.js';
import { ADMIN_UPLOAD_TIMEOUT_MS } from '@/lib/api/http.js';
import { parseApiErrorMessage, parseJsonBody } from '@/lib/api/parse.js';

/**
 * Multipart POST with progress — admin image uploads only.
 * @param {string} adminPath e.g. /products/{id}/image
 * @param {FormData} formData
 * @param {{ onProgress?: (pct: number) => void, idempotencyKey?: string, lockSet?: Set<string>, lockKey?: string, busyMessage?: string }} [options]
 */
export function adminUpload(adminPath, formData, options = {}) {
  const { onProgress, idempotencyKey, lockSet, lockKey, busyMessage } = options;

  if (lockSet && lockKey) {
    if (lockSet.has(lockKey)) {
      return Promise.reject(new Error(busyMessage || 'আপলোড ইতিমধ্যে চলছে। অনুগ্রহ করে অপেক্ষা করুন।'));
    }
    lockSet.add(lockKey);
  }

  const url = adminUrl(adminPath);
  const token = getLaravelAdminToken();
  if (!token) {
    if (lockSet && lockKey) lockSet.delete(lockKey);
    return Promise.reject(new Error('Laravel admin token missing. Log out and log in again.'));
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.timeout = ADMIN_UPLOAD_TIMEOUT_MS;
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    if (idempotencyKey) {
      xhr.setRequestHeader('Idempotency-Key', idempotencyKey);
    }

    const release = () => {
      if (lockSet && lockKey) lockSet.delete(lockKey);
    };

    if (typeof onProgress === 'function') {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      });
    }

    xhr.addEventListener('load', () => {
      const data = parseJsonBody(xhr.responseText || '');
      release();
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
        return;
      }
      const error = new Error(parseApiErrorMessage(data, xhr.status, `Upload failed (${xhr.status}).`));
      error.status = xhr.status;
      error.data = data;
      reject(error);
    });

    xhr.addEventListener('error', () => {
      release();
      reject(new Error('Network error during upload.'));
    });

    xhr.addEventListener('timeout', () => {
      xhr.abort();
      release();
      reject(new Error('Upload timed out. Try a smaller image or wait a moment and retry.'));
    });

    xhr.addEventListener('abort', () => {
      release();
      reject(new Error('Upload was cancelled.'));
    });

    xhr.send(formData);
  });
}

/** @param {string} adminPath */
export function adminDelete(adminPath) {
  return adminJson(adminPath, { method: 'DELETE' });
}
