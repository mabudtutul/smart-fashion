const REMEMBER_KEY = 'sf_admin_remember_me';
const EMAIL_KEY = 'sf_admin_remember_email';

export function loadRememberedEmail() {
  if (typeof window === 'undefined') return { remember: false, email: '' };
  try {
    const remember = localStorage.getItem(REMEMBER_KEY) === '1';
    const email = remember ? (localStorage.getItem(EMAIL_KEY) ?? '').trim() : '';
    return { remember, email };
  } catch {
    return { remember: false, email: '' };
  }
}

export function saveRememberedEmail(remember, email) {
  if (typeof window === 'undefined') return;
  try {
    if (remember && email.trim()) {
      localStorage.setItem(REMEMBER_KEY, '1');
      localStorage.setItem(EMAIL_KEY, email.trim());
    } else {
      localStorage.removeItem(REMEMBER_KEY);
      localStorage.removeItem(EMAIL_KEY);
    }
  } catch {
    /* ignore */
  }
}
