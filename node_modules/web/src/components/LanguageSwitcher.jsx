import React from 'react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslationWithFallback();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('en') ? 'bn' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <Button 
      type="button"
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className="touch-manipulation flex items-center gap-2 border-gray-300 text-gray-700 transition-colors hover:border-[#FF8C00] hover:text-[#FF8C00]"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">
        {i18n.language.startsWith('bn') ? 'বাংলা' : 'EN'}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;