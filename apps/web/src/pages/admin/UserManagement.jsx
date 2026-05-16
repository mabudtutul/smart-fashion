import React from 'react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const UserManagement = () => {
  const { t } = useTranslationWithFallback();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.users.title', 'Users')}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">{t('admin.users.name', 'Name')}</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">{t('admin.users.email', 'Email')}</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">{t('admin.users.role', 'Role')}</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500">{t('admin.users.status', 'Status')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                {t('common.loading', 'Loading...')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;