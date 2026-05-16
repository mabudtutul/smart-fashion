import React from 'react';
import { Search, Phone, User, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher.jsx';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback.js';

const Header = () => {
  const { t } = useTranslationWithFallback();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container-custom mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Logo */}
          <Link to="/" className="shrink-0 hover:opacity-80 transition-opacity duration-200">
            <img 
              src="https://horizons-cdn.hostinger.com/da7d55d7-4396-4d82-8c5b-069680062311/e2fd0920f302c630ef1fc79de2da3f98.png"
              alt="Smart Fashion Logo"
              className="h-14 md:h-20 w-auto object-contain"
            />
          </Link>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                type="text"
                placeholder={t('front.header.search', 'Search products')}
                className="pl-10 pr-4 h-11 w-full border-gray-300 focus:border-[#FF8C00] focus:ring-[#FF8C00] text-gray-900"
              />
            </div>
          </div>
          
          {/* Right Side Icons */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Contact Info */}
            <div className="hidden xl:flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-[#FF8C00]" />
              <span className="text-gray-700 font-medium">{t('front.header.contact', '+1-800-123-4567')}</span>
            </div>
            
            {/* Account Icon */}
            <Button 
              variant="ghost" 
              size="icon"
              title={t('front.header.account', 'Account')}
              className="text-gray-700 hover:text-[#FF8C00] transition-colors duration-200"
            >
              <User className="h-5 w-5" />
            </Button>
            
            {/* Wishlist Icon */}
            <Button 
              variant="ghost" 
              size="icon"
              title={t('front.header.wishlist', 'Wishlist')}
              className="text-gray-700 hover:text-[#FF8C00] transition-colors duration-200 relative"
            >
              <Heart className="h-5 w-5" />
            </Button>
            
            {/* Cart Icon with Badge */}
            <Button 
              variant="ghost" 
              size="icon"
              title={t('front.header.cart', 'Cart')}
              className="text-gray-700 hover:text-[#FF8C00] transition-colors duration-200 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-[#FF8C00] text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>
        
        {/* Mobile Search & Lang Switcher */}
        <div className="pb-4 md:hidden flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              type="text"
              placeholder={t('front.header.search', 'Search products')}
              className="pl-10 pr-4 h-11 w-full border-gray-300 focus:border-[#FF8C00] focus:ring-[#FF8C00] text-gray-900"
            />
          </div>
          <div className="sm:hidden shrink-0">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;