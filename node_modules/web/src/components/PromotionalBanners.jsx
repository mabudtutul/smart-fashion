import React from 'react';
import { Button } from '@/components/ui/button';

const PromotionalBanners = () => {
  return (
    <div className="py-12 bg-white">
      <div className="container-custom mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Yellow Hat Banner */}
          <div className="bg-yellow-400 rounded-2xl p-8 relative overflow-hidden min-h-[280px] flex flex-col justify-between">
            <div className="relative z-10">
              <p className="text-sm font-medium text-gray-800 mb-2">Style Collection</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Style Hat Cap
              </h3>
              <Button 
                size="sm"
                className="bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 active:scale-95"
              >
                Shop Now
              </Button>
            </div>
            <div className="absolute right-4 bottom-4 w-32 h-32 opacity-20">
              <div className="w-full h-full bg-gray-900 rounded-full"></div>
            </div>
          </div>
          
          {/* Dark Gray Watch Banner */}
          <div className="bg-[#333333] rounded-2xl p-8 relative overflow-hidden min-h-[280px] flex flex-col justify-between">
            <div className="relative z-10">
              <p className="text-sm font-medium text-gray-300 mb-2">Luxury Timepiece</p>
              <h3 className="text-3xl font-bold text-white mb-4">
                Daniel Wellington
              </h3>
              <Button 
                size="sm"
                className="bg-[#FF8C00] text-white hover:bg-[#FF8C00]/90 transition-all duration-200 active:scale-95"
              >
                Shop Now
              </Button>
            </div>
            <div className="absolute right-4 bottom-4 w-32 h-32 opacity-10">
              <div className="w-full h-full bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Red Diamond Ring Banner */}
          <div className="bg-red-500 rounded-2xl p-8 relative overflow-hidden min-h-[280px] flex flex-col justify-between">
            <div className="relative z-10">
              <p className="text-sm font-medium text-white/90 mb-2">Elegant Jewelry</p>
              <h3 className="text-3xl font-bold text-white mb-4">
                Diamond Ring
              </h3>
              <Button 
                size="sm"
                className="bg-white text-red-500 hover:bg-white/90 transition-all duration-200 active:scale-95"
              >
                Shop Now
              </Button>
            </div>
            <div className="absolute right-4 bottom-4 w-32 h-32 opacity-20">
              <div className="w-full h-full bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanners;