import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const LeftSidebar = () => {
  const { t } = useTranslationWithFallback();

  /** Matches `products.category` text in PocketBase */
  const categories = [
    { key: 'clothing', label: 'Clothing', pbCategory: 'Clothing' },
    { key: 'shoes', label: 'Shoes', pbCategory: 'Shoes' },
    { key: 'jewelry', label: 'Fashion Jewelry', pbCategory: 'Fashion Jewelry' },
    { key: 'mensFashion', label: "Men's Fashion", pbCategory: "Men's Fashion" },
    { key: 'womensFashion', label: "Women's Fashion", pbCategory: "Women's Fashion" },
    { key: 'footwear', label: 'Footwear', pbCategory: 'Footwear' },
    { key: 'beauty', label: 'Beauty & Care', pbCategory: 'Beauty & Care' },
    { key: 'furniture', label: 'Furniture', pbCategory: 'Furniture' },
    { key: 'bags', label: 'Bags & Backpack', pbCategory: 'Bags & Backpack' },
    { key: 'watches', label: 'Watches', pbCategory: 'Watches' }
  ];

  return (
    <div className="relative z-10 w-64 shrink-0 overflow-hidden rounded-lg bg-[#333333] text-white hidden lg:block">
      <div className="bg-[#2a2a2a] p-4 font-semibold">
        {t('front.nav.shopByCategory', 'SHOP BY CATEGORIES')}
      </div>

      <nav className="py-2" aria-label={t('front.sidebar.aria', 'Product categories')}>
        {categories.map((cat) => (
          <Link
            key={cat.key}
            to={`/category/${encodeURIComponent(cat.pbCategory)}`}
            className="group flex touch-manipulation items-center justify-between px-4 py-3 transition-colors duration-200 hover:bg-[#404040] active:opacity-90 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            <span className="text-sm">{t(`front.sidebar.${cat.key}`, cat.label)}</span>
            <ChevronRight className="h-4 w-4 text-gray-400 transition-colors duration-200 group-hover:text-white" aria-hidden />
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default LeftSidebar;
