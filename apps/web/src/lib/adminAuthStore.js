const listeners = new Set();

export function subscribeAdminAuth(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyAdminAuthChange() {
  listeners.forEach((listener) => listener());
}
