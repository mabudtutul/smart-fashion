import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { adminPageClass } from '@/components/admin/adminUi.js';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader.jsx';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState.jsx';

const OrderManagement = () => {
  const { t } = useTranslationWithFallback();

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title={t('admin.orders.title', 'অর্ডারসমূহ')}
        subtitle={t('admin.orders.subtitle', 'গ্রাহক অর্ডার ট্র্যাক করুন')}
      />
      <AdminEmptyState
        icon={ShoppingBag}
        title={t('admin.orders.emptyTitle', 'অর্ডার মডিউল শীঘ্রই')}
        description={t(
          'admin.orders.emptyDesc',
          'অর্ডার ব্যবস্থাপনা পরবর্তী আপডেটে যুক্ত হবে। এখন পণ্য ও ক্যাটাগরি পরিচালনা করুন।'
        )}
      />
    </div>
  );
};

export default OrderManagement;
