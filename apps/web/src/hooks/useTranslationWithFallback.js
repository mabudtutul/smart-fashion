import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useTranslationWithFallback = (ns) => {
  const { t, i18n, ready } = useTranslation(ns);

  const tWithFallback = useCallback((key, defaultValue, options) => {
    const translated = t(key, defaultValue, options);
    
    // If the translation returns the key itself, it means it's missing
    if (translated === key) {
      console.warn(`[i18n] Missing translation for key: "${key}" in language: "${i18n.language}"`);
      return defaultValue || key;
    }
    
    return translated;
  }, [t, i18n.language]);

  return { t: tWithFallback, i18n, ready };
};