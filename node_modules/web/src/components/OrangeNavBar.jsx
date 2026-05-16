import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const OrangeNavBar = () => {
  const { t } = useTranslationWithFallback();

  return (
    <div className="bg-[#FF8C00] text-white">
      <div className="container-custom mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <nav className="flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <button className="flex items-center gap-1 text-sm font-medium hover:text-white/90 transition-colors duration-200">
              {t('front.nav.shopByCategory', 'SHOP BY CATEGORIES')}
              <ChevronDown className="h-4 w-4" />
            </button>
            
            <a href="#" className="text-sm font-medium hover:text-white/90 transition-colors duration-200">
              {t('front.nav.aboutUs', 'About Us')}
            </a>
            
            <a href="#" className="text-sm font-medium hover:text-white/90 transition-colors duration-200">
              {t('front.nav.affiliates', 'Affiliates')}
            </a>
            
            <a href="#" className="text-sm font-medium hover:text-white/90 transition-colors duration-200">
              {t('front.nav.contactUs', 'Contact Us')}
            </a>
            
            <a href="#" className="text-sm font-medium hover:text-white/90 transition-colors duration-200">
              {t('front.nav.recentPosts', 'Recent Posts')}
            </a>
            
            <a href="#" className="text-sm font-medium hover:text-white/90 transition-colors duration-200">
              {t('front.nav.conditions', 'Blogs & Conditions')}
            </a>
            
            <button className="flex items-center gap-1 text-sm font-medium hover:text-white/90 transition-colors duration-200">
              {t('front.nav.more', 'More')}
              <ChevronDown className="h-4 w-4" />
            </button>
          </nav>
          
          <Button 
            size="sm"
            className="bg-white text-[#FF8C00] hover:bg-white/90 font-semibold transition-all duration-200 active:scale-95 shrink-0 hidden md:flex"
          >
            {t('front.nav.get20', 'Get 20%')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrangeNavBar;