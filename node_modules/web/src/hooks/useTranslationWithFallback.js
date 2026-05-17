import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/**
 * Wraps i18next `t` with the v23 API:
 * - t(key, 'fallback') → t(key, { defaultValue: 'fallback' })
 * - t(key, { count, ... }) passes through unchanged
 */
export const useTranslationWithFallback = (ns) => {
  const { t: i18nT, i18n, ready } = useTranslation(ns);

  const tWithFallback = useCallback(
    (key, defaultValueOrOptions, maybeOptions) => {
      if (typeof defaultValueOrOptions === 'string') {
        const opts =
          maybeOptions !== undefined && isPlainObject(maybeOptions)
            ? { defaultValue: defaultValueOrOptions, ...maybeOptions }
            : { defaultValue: defaultValueOrOptions };
        const out = i18nT(key, opts);
        if (out === key) return defaultValueOrOptions;
        return out;
      }

      if (defaultValueOrOptions === undefined) {
        const out = i18nT(key);
        if (out === key) {
          console.warn(`[i18n] Missing translation for key: "${key}" in language: "${i18n.language}"`);
        }
        return out;
      }

      if (isPlainObject(defaultValueOrOptions)) {
        const out = i18nT(key, defaultValueOrOptions);
        if (out === key) {
          const dv = defaultValueOrOptions.defaultValue;
          if (typeof dv === 'string') return dv;
          console.warn(`[i18n] Missing translation for key: "${key}" in language: "${i18n.language}"`);
        }
        return out;
      }

      return i18nT(key);
    },
    [i18nT, i18n.language]
  );

  return { t: tWithFallback, i18n, ready };
};
