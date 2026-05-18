import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import CatalogImage from '@/components/CatalogImage.jsx';
import { catalog, catalogErrorMessage } from '@/lib/catalog';

import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const ShopCategoriesGrid = () => {
  const { t } = useTranslationWithFallback();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const records = await catalog.listCategories(1, 6, { sort: 'sort_order' });
      setCategories(records.items ?? []);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error fetching categories:', err);
      setLoadError(catalogErrorMessage(err, t('front.sections.loadError', 'Could not load categories.')));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container-custom mx-auto px-4">
          <Skeleton className="h-8 w-64 mb-8 mx-auto" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const defaultCategories = [
    { name: "Women's Fashion", color: 'bg-pink-100' },
    { name: "Fashion Jewelry", color: 'bg-purple-100' },
    { name: "Men's Fashion", color: 'bg-blue-100' },
    { name: "Kid's Fashion", color: 'bg-yellow-100' },
    { name: "Footwear", color: 'bg-green-100' },
    { name: "Shop All", color: 'bg-orange-100' }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section id="shop-categories" className="relative z-0 overflow-x-clip bg-gray-50 py-10 sm:py-12">
      <div className="container-custom mx-auto px-4">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 sm:mb-8 sm:text-3xl">
          {t('front.sections.shopByCategory', 'Shop by categories')}
        </h2>

        {loadError ? (
          <p className="mb-4 text-center text-sm text-amber-700" role="status">
            {loadError}
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {displayCategories.map((category, index) => {
            const hasImage = Boolean(category.image || category.image_url || category.image_path);
            
            return (
              <Link
                key={category.id || index}
                to={`/category/${encodeURIComponent(category.name)}`}
                className="group relative z-0 block touch-manipulation rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C00] focus-visible:ring-offset-2"
              >
                <div
                  className={`relative mb-2 aspect-square overflow-hidden rounded-xl border border-slate-100 bg-slate-100 sm:mb-3 ${!hasImage ? category.color || 'bg-gray-200' : ''}`}
                >
                  {hasImage ? (
                    <CatalogImage
                      record={category}
                      imageOptions={{ thumb: '300x300', size: 'banner' }}
                      alt={category.name}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-4xl opacity-20">👗</span>
                    </div>
                  )}
                  
                  {/* Dot indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none" aria-hidden>
                    <div className="w-2 h-2 rounded-full bg-white/60"></div>
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    <div className="w-2 h-2 rounded-full bg-white/60"></div>
                  </div>
                </div>
                
                <h3 className="text-sm font-medium text-center text-gray-900 group-hover:text-[#FF8C00] transition-colors duration-200">
                  {category.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShopCategoriesGrid;