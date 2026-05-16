import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const LeftSidebar = () => {
  const { t } = useTranslationWithFallback();

  const categories = [
    { key: 'clothing', label: "Clothing" },
    { key: 'shoes', label: "Shoes" },
    { key: 'jewelry', label: "Fashion Jewelry" },
    { key: 'mensFashion', label: "Men's Fashion" },
    { key: 'womensFashion', label: "Women's Fashion" },
    { key: 'footwear', label: "Footwear" },
    { key: 'beauty', label: "Beauty & Care" },
    { key: 'furniture', label: "Furniture" },
    { key: 'bags', label: "Bags & Backpack" },
    { key: 'watches', label: "Watches" }
  ];

  return (
    <div className="w-64 bg-[#333333] text-white rounded-lg overflow-hidden hidden lg:block shrink-0">
      <div className="p-4 bg-[#2a2a2a] font-semibold">
        {t('front.nav.shopByCategory', 'SHOP BY CATEGORIES')}
      </div>
      
      <nav className="py-2">
        {categories.map((cat) => (
          <a
            key={cat.key}
            href="#"
            className="flex items-center justify-between px-4 py-3 hover:bg-[#404040] transition-colors duration-200 group"
          >
            <span className="text-sm">{t(`front.sidebar.${cat.key}`, cat.label)}</span>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
          </a>
        ))}
      </nav>
    </div>
  );
};

export default LeftSidebar;