import React from 'react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const OrderManagement = () => {
  const { t } = useTranslationWithFallback();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.orders.title', 'Orders')}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">{t('admin.orders.id', 'Order ID')}</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">{t('admin.orders.customer', 'Customer')}</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">{t('admin.orders.total', 'Total')}</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">{t('admin.orders.status', 'Status')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                {t('common.noResults', 'No Results')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;