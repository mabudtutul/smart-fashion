import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * Prevents duplicate form submissions (double-click, Enter spam, slow network retries).
 */
export function useSubmitGuard() {
  const lockRef = useRef(false);
  const [isPending, setIsPending] = useState(false);

  const isLocked = isPending;

  const acquire = useCallback(() => {
    if (lockRef.current) {
      return false;
    }
    lockRef.current = true;
    setIsPending(true);
    return true;
  }, []);

  const release = useCallback(() => {
    lockRef.current = false;
    setIsPending(false);
  }, []);

  /**
   * @template T
   * @param {() => Promise<T>} task
   * @returns {Promise<{ skipped: true } | { skipped: false, result: T }>}
   */
  const run = useCallback(
    async (task) => {
      if (!acquire()) {
        return { skipped: true };
      }
      try {
        const result = await task();
        return { skipped: false, result };
      } finally {
        release();
      }
    },
    [acquire, release]
  );

  const guardSubmit = useCallback((handler) => {
    return async (event) => {
      event?.preventDefault?.();
      if (lockRef.current) {
        event?.stopPropagation?.();
        return undefined;
      }
      return handler(event);
    };
  }, []);

  const formHandlers = useMemo(
    () => ({
      onKeyDown: (event) => {
        if (!lockRef.current) {
          return;
        }
        if (event.key === 'Enter' && event.target?.tagName !== 'TEXTAREA') {
          event.preventDefault();
        }
      },
    }),
    []
  );

  return {
    isPending,
    isLocked,
    run,
    guardSubmit,
    formHandlers,
    isSubmittingRef: lockRef,
  };
}

/** Fresh idempotency key per dialog open (create only). */
export function createIdempotencyKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `idem-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
