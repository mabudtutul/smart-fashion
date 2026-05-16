import React from 'react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SettingsPage = () => {
  const { t } = useTranslationWithFallback();

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('admin.settings.title', 'Site Settings')}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>{t('admin.settings.siteName', 'Site Name')}</Label>
            <Input defaultValue="FlexCart" />
          </div>
          <div className="space-y-2">
            <Label>{t('admin.settings.contactEmail', 'Contact Email')}</Label>
            <Input type="email" defaultValue="contact@flexcart.com" />
          </div>
          <div className="space-y-2">
            <Label>{t('admin.settings.currency', 'Currency')}</Label>
            <Input defaultValue="USD" />
          </div>
          <div className="space-y-2">
            <Label>{t('admin.settings.taxRate', 'Tax Rate (%)')}</Label>
            <Input type="number" defaultValue="8" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button className="bg-[#FF8C00] hover:bg-[#FF8C00]/90">
            {t('common.save', 'Save')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;