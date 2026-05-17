import React, { Suspense, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n.js';

const syncHtmlLang = () => {
  const lng = i18n.resolvedLanguage || i18n.language || 'bn';
  document.documentElement.lang = lng.startsWith('bn') ? 'bn' : 'en';
};

export const I18nProvider = ({ children }) => {
  useEffect(() => {
    syncHtmlLang();
    i18n.on('languageChanged', syncHtmlLang);
    return () => {
      i18n.off('languageChanged', syncHtmlLang);
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
        {children}
      </Suspense>
    </I18nextProvider>
  );
};

export default I18nProvider;