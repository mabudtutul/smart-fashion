import React from 'react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminGlassCard, adminPageClass, adminPrimaryBtn, adminInputClass } from '@/components/admin/adminUi.js';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader.jsx';

const SettingsPage = () => {
  const { t } = useTranslationWithFallback();

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title={t('admin.settings.title', 'সাইট সেটিংস')}
        subtitle={t('admin.settings.subtitle', 'স্টোরের সাধারণ কনফিগারেশন')}
      />

      <div className={`${adminGlassCard} p-6 sm:p-8 max-w-3xl space-y-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>{t('admin.settings.siteName', 'সাইটের নাম')}</Label>
            <Input className={adminInputClass} defaultValue="Smart Fashion" />
          </div>
          <div className="space-y-2">
            <Label>{t('admin.settings.contactEmail', 'যোগাযোগ ইমেইল')}</Label>
            <Input type="email" className={adminInputClass} defaultValue="contact@smartfashion.com" />
          </div>
          <div className="space-y-2">
            <Label>{t('admin.settings.currency', 'মুদ্রা')}</Label>
            <Input className={adminInputClass} defaultValue="BDT (৳)" readOnly />
          </div>
          <div className="space-y-2">
            <Label>{t('admin.settings.taxRate', 'ট্যাক্স (%)')}</Label>
            <Input type="number" className={adminInputClass} defaultValue="0" />
          </div>
        </div>

        <p className="text-xs text-slate-500">
          {t('admin.settings.comingSoon', 'সেটিংস সংরক্ষণ শীঘ্রই সক্রিয় হবে।')}
        </p>

        <div className="pt-2 flex justify-end">
          <Button type="button" className={adminPrimaryBtn} disabled>
            {t('common.save', 'সংরক্ষণ')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
