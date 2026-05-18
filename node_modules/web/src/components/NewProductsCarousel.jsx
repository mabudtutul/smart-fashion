import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ProductCard.jsx';
import { catalog } from '@/lib/catalog';

import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const NewProductsCarousel = () => {
  const { t } = useTranslationWithFallback();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewProducts();
  }, []);

  const fetchNewProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const records = await catalog.listProducts(1, 12, { sort: '-created' });
      setProducts(records.items);
    } catch (err) {
      console.error('[NewProducts] Error fetching new products:', err);
      setError(t('front.sections.loadError', 'Could not load this section. Try again later.'));
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    const container = document.getElementById('new-products-scroll');
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="py-12 bg-white">
        <div className="container-custom mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 bg-white">
        <div className="container-custom mx-auto px-4 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchNewProducts} variant="outline" type="button" className="touch-manipulation">
            {t('front.sections.tryAgain', 'Try again')}
          </Button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="overflow-x-clip bg-white py-10 sm:py-12">
      <div className="container-custom mx-auto px-4">
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t('front.sections.newProducts', 'New products')}</h2>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full transition-all duration-200 active:scale-95"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full transition-all duration-200 active:scale-95"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div
          id="new-products-scroll"
          className="catalog-carousel-track scrollbar-hide -mx-4 scroll-smooth px-4 sm:mx-0 sm:px-0"
        >
          {products.map((product) => (
            <div key={product.id} className="catalog-carousel-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewProductsCarousel;