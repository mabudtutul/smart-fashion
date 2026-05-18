import { useEffect, useRef } from 'react';
import { createIdempotencyKey } from '@/hooks/useSubmitGuard.js';

/**
 * One idempotency key per dialog session — safe for retries, blocks duplicate creates.
 */
export function useFormIdempotencyKey(dialogOpen, resetWhen) {
  const keyRef = useRef(null);

  useEffect(() => {
    if (!dialogOpen) {
      keyRef.current = null;
      return;
    }
    keyRef.current = createIdempotencyKey();
  }, [dialogOpen, resetWhen]);

  return keyRef;
}
