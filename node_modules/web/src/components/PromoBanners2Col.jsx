import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const PromoBanners2Col = () => {
  const { t } = useTranslationWithFallback();
  return (
    <div className="py-8 bg-white">
      <div className="container-custom mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Orange Lifestyle Banner */}
          <div className="bg-gradient-to-br from-[#FF8C00] to-[#FF6B00] rounded-2xl p-10 relative overflow-hidden min-h-[320px] flex items-center">
            <div className="relative z-10 max-w-md">
              <h3 className="text-4xl font-bold text-white mb-6" style={{ letterSpacing: '-0.02em' }}>
                The Pretty Lifestyle
              </h3>
              <Button 
                type="button"
                size="lg"
                className="touch-manipulation bg-white font-semibold text-[#FF8C00] hover:bg-white/90 transition-all duration-200 active:scale-95 max-md:min-h-[44px]"
              >
                {t('front.hero.shopNow', 'Shop Now')}
              </Button>
            </div>
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
              <div className="w-full h-full bg-white rounded-full blur-3xl"></div>
            </div>
          </div>
          
          {/* Dark Gray Bag Collection Banner */}
          <div className="bg-[#333333] rounded-2xl p-10 relative overflow-hidden min-h-[320px] flex items-center">
            <div className="relative z-10 max-w-md">
              <h3 className="text-4xl font-bold text-white mb-6" style={{ letterSpacing: '-0.02em' }}>
                Women's Bag Collection
              </h3>
              <Button 
                type="button"
                size="lg"
                className="touch-manipulation bg-[#FF8C00] font-semibold text-white hover:bg-[#FF8C00]/90 transition-all duration-200 active:scale-95 max-md:min-h-[44px]"
              >
                {t('front.hero.shopNow', 'Shop Now')}
              </Button>
            </div>
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-5">
              <div className="w-full h-full bg-white rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanners2Col;