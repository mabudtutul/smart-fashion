import React, { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n.js';

export const I18nProvider = ({ children }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
        {children}
      </Suspense>
    </I18nextProvider>
  );
};

export default I18nProvider;