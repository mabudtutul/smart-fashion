import React from 'react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const CategoryManagement = () => {
  const { t } = useTranslationWithFallback();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.categories.title', 'Categories')}</h1>
        <Button className="bg-[#FF8C00] hover:bg-[#FF8C00]/90">
          <Plus className="h-4 w-4 mr-2" />
          {t('admin.categories.add', 'Add Category')}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
        <p>{t('common.noResults', 'No Results')}</p>
      </div>
    </div>
  );
};

export default CategoryManagement;