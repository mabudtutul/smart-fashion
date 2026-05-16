import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const HeroSection = () => {
  const { t } = useTranslationWithFallback();

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      {/* Hero Banner Image */}
      <div className="relative w-full aspect-video md:aspect-auto md:h-[500px] lg:h-[600px]">
        <img 
          src="https://horizons-cdn.hostinger.com/da7d55d7-4396-4d82-8c5b-069680062311/f183080bf46077736ba789261d4c1901.png"
          alt="Smart Fashion Hero Banner - Dress Smart, Look Smart, Be Smart"
          className="w-full h-full object-cover object-center"
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-8 md:py-12">
          <div className="text-center max-w-2xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-6" style={{ letterSpacing: '-0.02em' }}>
              {t('front.hero.title', 'STYLES.WEAR')}
            </h1>
            <p className="text-lg md:text-xl text-white/95 mb-6 md:mb-8 font-medium">
              {t('front.hero.subtitle', 'New Brands Cloth Incoming')}
            </p>
            <Button 
              size="lg"
              className="bg-[#FF8C00] text-white hover:bg-[#FF8C00]/90 font-semibold transition-all duration-200 active:scale-95"
            >
              {t('front.hero.shopNow', 'Shop Now')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;