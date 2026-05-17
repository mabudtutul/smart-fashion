import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { catalog, catalogErrorMessage, getRecordImageUrl } from '@/lib/catalog';

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
      const records = await catalog.listCategories(1, 6, { sort: '-created' });
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
    <section id="shop-categories" className="relative z-0 py-12 bg-gray-50">
      <div className="container-custom mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">{t('front.sections.shopByCategory', 'Shop by categories')}</h2>

        {loadError ? (
          <p className="mb-4 text-center text-sm text-amber-700" role="status">
            {loadError}
          </p>
        ) : null}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((category, index) => {
            const imageUrl = getRecordImageUrl(category, { thumb: '300x300' });
            
            return (
              <Link
                key={category.id || index}
                to={`/category/${encodeURIComponent(category.name)}`}
                className="group relative z-0 block touch-manipulation rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8C00] focus-visible:ring-offset-2"
              >
                <div className={`aspect-square rounded-lg overflow-hidden mb-3 ${!imageUrl ? (category.color || 'bg-gray-200') : ''} relative`}>
                  {imageUrl ? (
                    <img 
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
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