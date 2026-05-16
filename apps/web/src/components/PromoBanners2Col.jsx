import React from 'react';
import { Button } from '@/components/ui/button';

const PromoBanners2Col = () => {
  return (
    <div className="py-12 bg-white">
      <div className="container-custom mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Orange Lifestyle Banner */}
          <div className="bg-gradient-to-br from-[#FF8C00] to-[#FF6B00] rounded-2xl p-10 relative overflow-hidden min-h-[320px] flex items-center">
            <div className="relative z-10 max-w-md">
              <p className="text-sm font-medium text-white/90 mb-2">2020 Collection</p>
              <h3 className="text-4xl font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
                The Pretty Lifestyle
              </h3>
              <p className="text-white/80 mb-6">
                Discover the latest trends in fashion and lifestyle
              </p>
              <Button 
                size="lg"
                className="bg-white text-[#FF8C00] hover:bg-white/90 font-semibold transition-all duration-200 active:scale-95"
              >
                Shop Now
              </Button>
            </div>
            <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
              <div className="w-full h-full bg-white rounded-full blur-3xl"></div>
            </div>
          </div>
          
          {/* Dark Gray Bag Collection Banner */}
          <div className="bg-[#333333] rounded-2xl p-10 relative overflow-hidden min-h-[320px] flex items-center">
            <div className="relative z-10 max-w-md">
              <p className="text-sm font-medium text-gray-300 mb-2">Premium Collection</p>
              <h3 className="text-4xl font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
                Women's Bag Collection
              </h3>
              <p className="text-gray-300 mb-6">
                Elegant designs for the modern woman
              </p>
              <Button 
                size="lg"
                className="bg-[#FF8C00] text-white hover:bg-[#FF8C00]/90 font-semibold transition-all duration-200 active:scale-95"
              >
                Shop Now
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