import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ProductCard.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const BestSellersCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[BestSellers] Fetching products with filter: bestseller = true');
      const records = await pb.collection('products').getList(1, 10, {
        filter: 'bestseller = true',
        sort: '-created',
        $autoCancel: false
      });
      console.log(`[BestSellers] Successfully fetched ${records.items.length} items`, records.items);
      setProducts(records.items);
    } catch (err) {
      console.error('[BestSellers] Error fetching bestsellers:', err);
      setError('Failed to load best sellers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart`);
  };

  const scroll = (direction) => {
    const container = document.getElementById('bestsellers-scroll');
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container-custom mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
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
      <div className="py-12 bg-gray-50">
        <div className="container-custom mx-auto px-4 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchBestSellers} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container-custom mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Best sellers</h2>
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
          id="bestsellers-scroll"
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-none w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(20%-13px)]">
              <ProductCard product={product} onAddToCart={handleAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellersCarousel;